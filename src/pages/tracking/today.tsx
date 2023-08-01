import styles from '@styles/pages/Today.module.scss';
import { useAuthContext } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TableAction, pages, table_action, task_status } from '@/lib/constants';
import { ToastMessage } from 'primereact/toast';
import { CalendarIcon } from '@/lib/icon';
import { createNewTask } from '@/firebase/store/task/add';
import { Task, UpdateTaskData } from '@/interfaces';
import { QuerySnapshot } from 'firebase/firestore';
import { formatSecondsToHMS, getCurrentUTCDate } from '@/lib/utils';
import { updateTask, updateActiveTask, stopAllTasks } from '@/firebase/store/task/update';
import { deleteTask } from '@/firebase/store/task/delete';
import { getRunningTasks } from '@/firebase/store/task/get';
import Layout from '@/components/layout';
import ButtonWithTextAndIcon from '@/components/buttons/buttonWithTextAndIcon';
import Table from '@/components/table';
import NewTaskForm from '@/components/forms/newTaskForm';
import Paging from '@/components/paging';

type Props = {
  showToastMessage: (message: ToastMessage) => void;
};
function Page({ showToastMessage }: Props) {
  const { user } = useAuthContext();
  const router = useRouter();

  const today = new Date().toLocaleDateString('HR'); // for EN use en-US

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [loading, setLoading] = useState<{
    taskCreate?: boolean;
    taksDelete?: boolean;
    taskDescriptionUpdate?: boolean;
    deletedTaskUid?: string;
    stopAll?: boolean;
  }>({});

  const [tasks, setTasks] = useState<Task[]>([]);
  const [lastSnaphot, setLastSnapshot] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [secondsCounter, setSecondsCounter] = useState<number>(0);
  const [nodeJsTimer, setNodeJsTimer] = useState<NodeJS.Timer | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loggedTime, setLoggedTime] = useState<number>(0);

  const [taskToEdit, setTaskToEdit] = useState<{ uid?: string; description?: string }>({});

  const resetTimer = (t: NodeJS.Timer) => {
    clearInterval(t);
    setNodeJsTimer(null);
    setSecondsCounter(0);
  };

  const activateTimer = () => {
    const t = setInterval(() => {
      setSecondsCounter(prev => prev + 1);
    }, 1000);

    setNodeJsTimer(t);
  };

  useEffect(() => {
    if (activeTask && activeTask.loggedSeconds !== null) {
      const updatedTasks = tasks.map(t =>
        t.uid === activeTask.uid ? { ...t, loggedSeconds: activeTask.loggedSeconds + secondsCounter } : t
      );
      setTasks(updatedTasks);
      setLoggedTime(activeTask.loggedSeconds + secondsCounter);
    }

    if (activeTask && secondsCounter % 120 === 0) {
      updateTask(activeTask.uid, { loggedSeconds: loggedTime });
    }
  }, [secondsCounter]);

  useEffect(() => {
    if (activeTask && !nodeJsTimer && secondsCounter === 0) {
      activateTimer();
    }
  }, [activeTask]);

  const getTasks = async ({ startTimer }: { startTimer?: boolean } = {}) => {
    if (!user) return;

    const { result, error } = await getRunningTasks(user.uid, lastSnaphot);

    if (result) {
      setTasks(result.list);
      setLastSnapshot(result.snapshot?.docs.length ? result.snapshot.docs[result.snapshot.docs.length - 1] : null);
      if (result.activeTaskUid) {
        const task = result.list.find(t => t.uid === result.activeTaskUid);
        if (task) {
          if (startTimer) {
            activateTimer();
          }
          setActiveTask(task);
        }
      }
    } else {
      showToastMessage({ severity: 'error', summary: 'An error occurred.' });
    }
  };

  useEffect(() => {
    if (user == null) router.push('/sign-in');
    getTasks();
  }, [user]);

  const handleStopAll = async () => {
    if (!user) return;
    setLoading({ stopAll: true });
    // if there is currently active task stop it, and save its logged time
    if (activeTask) {
      const data: UpdateTaskData = {
        status: task_status.COMPLETED,
        endDate: getCurrentUTCDate(),
        loggedSeconds: loggedTime,
      };
      await updateTask(activeTask.uid, data);

      await updateActiveTask(user.uid, null);
      setActiveTask(null);
      if (nodeJsTimer) {
        resetTimer(nodeJsTimer);
      }
    }
    await stopAllTasks(user.uid);
    setLoading({});
  };

  const handleSaveTimeOnCurrentTaskAndResetTimer = async (uid: string) => {
    if (nodeJsTimer) {
      resetTimer(nodeJsTimer);
    }
    await updateTask(uid, { loggedSeconds: loggedTime });
    setActiveTask(null);
  };

  const handleCreateTask = async (description: string) => {
    if (!user) return;

    try {
      // stop and store currently active task and logged time
      if (activeTask) {
        await handleSaveTimeOnCurrentTaskAndResetTimer(activeTask.uid);
      }

      setLoading({ taskCreate: true });
      const { result, error } = await createNewTask({ description, userUid: user.uid });

      if (error) {
        showToastMessage({ severity: 'error', summary: 'Something went wrong when creating task.' });
      } else {
        showToastMessage({ severity: 'success', summary: 'Task successfuly created!' });
        setLoading({});
        setShowNewTaskForm(false);
        getTasks({ startTimer: true });
      }
    } catch (e) {}
  };

  const handleStopTimerOnTask = async (uid: string) => {
    const isCurrentlyActiveTaskStopped = activeTask && activeTask.uid === uid;
    const data: UpdateTaskData = {
      status: task_status.COMPLETED,
      endDate: getCurrentUTCDate(),
      ...(isCurrentlyActiveTaskStopped && { loggedSeconds: loggedTime }),
    };
    await updateTask(uid, data);

    if (isCurrentlyActiveTaskStopped) {
      if (!user) return;
      await updateActiveTask(user.uid, null);
      setActiveTask(null);
      if (nodeJsTimer) {
        resetTimer(nodeJsTimer);
      }
    }

    getTasks();
  };

  const handleStartTimerOnTask = async (uid: string) => {
    if (!user) return;

    if (activeTask && nodeJsTimer) {
      // stop timer on previously active task
      resetTimer(nodeJsTimer);
    }

    const task = tasks.find(t => t.uid === uid);
    if (task) {
      setActiveTask(task);
      activateTimer();
      await updateActiveTask(user.uid, uid);
      getTasks();
    }
  };

  const handlePauseTimerOnTask = async (uid: string) => {
    if (!user) return;

    await handleSaveTimeOnCurrentTaskAndResetTimer(uid);
    await updateActiveTask(user.uid, null);
    getTasks();
  };

  const handleDeleteTask = async (uid: string) => {
    if (!user) return;

    setLoading({ taksDelete: true, deletedTaskUid: uid });
    if (activeTask && activeTask.uid === uid) {
      await updateActiveTask(user.uid, null);
      setActiveTask(null);
      if (nodeJsTimer) {
        resetTimer(nodeJsTimer);
      }
    }

    await deleteTask(uid);
    setLoading({});
    getTasks();
  };

  const handleEditTask = (uid: string) => {
    const task = tasks.find(t => t.uid === uid);
    if (task) {
      setTaskToEdit(task);
    }
  };

  const handleTaskAction = (action: TableAction, uid: string) => {
    switch (action) {
      case table_action.START:
        return handleStartTimerOnTask(uid);
      case table_action.PAUSE:
        return handlePauseTimerOnTask(uid);
      case table_action.STOP:
        return handleStopTimerOnTask(uid);
      case table_action.DELETE:
        return handleDeleteTask(uid);
      case table_action.EDIT:
        return handleEditTask(uid);
      default:
    }
  };

  const handleUpdateTaskDescription = async (uid: string, description: string) => {
    if (!description || !description.trim().length) {
      return;
    }

    setLoading({ taskDescriptionUpdate: true });
    await updateTask(uid, { description });
    await getTasks();
    setTaskToEdit({});
    setLoading({});
  };

  const handleCancelTaskDescription = () => {
    setTaskToEdit({});
  };

  return (
    <Layout activePage={pages.TODAY} showToastMessage={showToastMessage}>
      <div className={styles.wrapper}>
        <h1>
          <CalendarIcon />
          <span>Today ({today})</span>
        </h1>
        <div className={styles.buttons}>
          <ButtonWithTextAndIcon
            iconName='WatchIcon'
            text='Start new timer'
            bgColor='orange'
            onClick={() => setShowNewTaskForm(!showNewTaskForm)}
          />
          <ButtonWithTextAndIcon
            iconName='StopIcon'
            text='Stop all'
            bgColor='portGore'
            loading={loading.stopAll}
            onClick={handleStopAll}
          />
        </div>
        {showNewTaskForm && (
          <NewTaskForm
            className={styles.newTaskForm}
            loading={loading.taskCreate}
            onCreateTaskClick={handleCreateTask}
            onCancelCreateTaskClick={() => setShowNewTaskForm(false)}
          />
        )}
        <Table
          className={styles.table}
          data={tasks.map(t => {
            const loggedSeconds = activeTask?.uid === t.uid ? loggedTime : t.loggedSeconds;
            return {
              ...t,
              isActive: activeTask?.uid === t.uid,
              isEdited: taskToEdit?.uid === t.uid,
              duration: formatSecondsToHMS(loggedSeconds),
              isTaskDeleteInProgress: loading.taksDelete && t.uid === loading.deletedTaskUid,
              isTaskDescriptionUpdateInProgress: loading.taskDescriptionUpdate && taskToEdit.uid === t.uid,
            };
          })}
          onClick={handleTaskAction}
          onTaskDescriptionUpdate={handleUpdateTaskDescription}
          onTaskDescriptionCancel={handleCancelTaskDescription}
        />
      </div>
      <Paging totalRecords={50} className={styles.paging} onChange={() => {}} />
    </Layout>
  );
}

export default Page;
