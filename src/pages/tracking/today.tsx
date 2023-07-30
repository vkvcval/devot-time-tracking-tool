import styles from '@styles/pages/Today.module.scss';
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout';
import { Nullable } from 'primereact/ts-helpers';
import { pages, timerStatus } from '@/lib/constants';
import { ToastMessage } from 'primereact/toast';
import { CalendarIcon } from '@/lib/icon';
import ButtonWithTextAndIcon from '@/components/buttons/buttonWithTextAndIcon';
import Table from '@/components/table';
import NewTaskForm from '@/components/forms/newTaskForm';
import createNewTask from '@/firebase/store/task/add';
import getTodaysTasks from '@/firebase/store/task/get-todays-tasks';
import { Task } from '@/interfaces';
import getActiveTask from '@/firebase/store/task/get-active-task';
import { QuerySnapshot } from 'firebase/firestore';
import { formatSecondsToHMS } from '@/lib/utils';

type Props = {
  showToastMessage: (message: ToastMessage) => void;
};
function Page({ showToastMessage }: Props) {
  const { user } = useAuthContext();
  const router = useRouter();
  const [value, setValue] = useState<Nullable<string>>(null);

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [isTaskCreationInProgress, setIsTaskCreationInProgress] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [lastSnaphot, setLastSnapshot] = useState<any>(null);
  const [activeTaskUid, setActiveTaskUid] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [time, setTime] = React.useState<number>(0);

  useEffect(() => {
    setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  }, []);

  const getTasks = async () => {
    if (!user) return;
    const { result, error } = await getTodaysTasks(user.uid, lastSnaphot);

    if (result) {
      setTasks([...tasks, ...result.list]);
      setLastSnapshot(result.snapshot?.docs.length ? result.snapshot.docs[result.snapshot.docs.length - 1] : null);
    } else {
      showToastMessage({ severity: 'error', summary: 'An error occurred.' });
    }
  };

  const getActive = async () => {
    if (!user) return;
    const { result, error } = await getActiveTask(user.uid);

    if (result) {
      setActiveTaskUid(result.activeTaskUid);
    } else {
      showToastMessage({ severity: 'error', summary: 'An error occurred.' });
    }
  };

  useEffect(() => {
    if (user == null) router.push('/sign-in');
    getTasks();
    getActive();
  }, [user]);

  const today = new Date().toLocaleDateString('HR'); // for EN use en-US

  const handleStopTimer = () => {};

  const handleCreateTask = async (description: string) => {
    if (!user) return;

    try {
      setIsTaskCreationInProgress(true);
      const { result, error } = await createNewTask({ description, userUid: user.uid });

      if (error) {
        showToastMessage({ severity: 'error', summary: 'Something went wrong when creating task.' });
      } else {
        showToastMessage({ severity: 'success', summary: 'Task successfuly created!' });
        setIsTaskCreationInProgress(false);
        setShowNewTaskForm(false);
        getTasks();
      }
    } catch (e) {}
  };

  return (
    <Layout activePage={pages.TODAY} showToastMessage={showToastMessage}>
      <div className={styles.wrapper}>
        <h1>
          <CalendarIcon />
          <span>Today ({today})</span>
          {formatSecondsToHMS(time)}
        </h1>
        <div className={styles.buttons}>
          <ButtonWithTextAndIcon
            iconName='WatchIcon'
            text='Start new timer'
            bgColor='orange'
            onClick={() => setShowNewTaskForm(!showNewTaskForm)}
          />
          <ButtonWithTextAndIcon iconName='StopIcon' text='Stop all' bgColor='portGore' onClick={handleStopTimer} />
        </div>
        {showNewTaskForm && (
          <NewTaskForm
            className={styles.newTaskForm}
            isLoading={isTaskCreationInProgress}
            onCreateTaskClick={handleCreateTask}
            onCancelCreateTaskClick={() => setShowNewTaskForm(false)}
          />
        )}

        <Table
          data={tasks.map(t => {
            const timeLogged = formatSecondsToHMS(0);
            return {
              ...t,
              state: t.uid === activeTaskUid ? timerStatus.ACTIVE : timerStatus.INACTIVE,
              duration: timeLogged,
            };
          })}
        />
      </div>

      {/*    <button>1</button>
      <button onClick={handleNextPage}>2</button>
      <button>3</button> */}
    </Layout>
  );
}

export default Page;
