import styles from '@styles/pages/History.module.scss';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { TableAction, items_per_page, pages, table_action } from '@/lib/constants';
import { ToastMessage } from 'primereact/toast';
import { CalendarIcon } from '@/lib/icon';
import { convertDateStringToUnixTimestamp, formatSecondsToHMS } from '@/lib/utils';
import { LoadingActions, Task } from '@/interfaces';
import { updateTask } from '@/firebase/store/task/update';
import { getCompletedTasks } from '@/firebase/store/task/get';
import { deleteTask } from '@/firebase/store/task/delete';
import { Nullable } from 'primereact/ts-helpers';
import Layout from '@/components/layout';
import Table from '@/components/table';
import SearchHistory from '@/components/filters/searchHistory';
import Paging from '@/components/paging';

type Props = {
  showToastMessage: (message: ToastMessage) => void;
};

export default function History({ showToastMessage }: Props) {
  const { user } = useAuthContext();
  const router = useRouter();

  const [loading, setLoading] = useState<LoadingActions>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [totalCompletedTasksCount, setTotalRunningTasksCount] = useState(0);
  const [tasksOnPage, setTasksOnPage] = useState<Task[]>([]);
  const [startIndexOnPage, setStartIndexOnPage] = useState(0);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<{ uid?: string; description?: string }>({});
  const [searchDescriptionValue, setSearchDescriptionValue] = useState('');
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);

  useEffect(() => {
    if (user == null) router.push('/sign-in');
  }, [user]);

  const getTasks = async () => {
    if (!user) return;

    const { result, error } = await getCompletedTasks(user.uid);

    if (result) {
      setTasks(result.list);
      setFilteredTasks(result.list);
      setTasksOnPage(result.list.slice(startIndexOnPage, items_per_page));

      if (result.count) {
        setTotalRunningTasksCount(result.count);
      }
    } else {
      showToastMessage({ severity: 'error', summary: 'An error occurred.' });
    }
  };

  useEffect(() => {
    if (user == null) router.push('/sign-in');
    getTasks();
  }, [user]);

  const handleDeleteTask = async (uid: string) => {
    if (!user) return;
    setLoading({ taksDelete: true, deletedTaskUid: uid });
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

  const handlePageChange = async (index: number) => {
    setStartIndexOnPage(index);
    setTasksOnPage(tasks.slice(index, index + items_per_page));
  };

  const handleTaskFiltering = (startDate: Date | null, endDate: Date | null, description: string) => {
    const startDateTs = startDate ? convertDateStringToUnixTimestamp(startDate) : null;
    const endDateTs = endDate ? convertDateStringToUnixTimestamp(endDate) : null;
    const filtered = tasks.filter(task => {
      const taskStart = convertDateStringToUnixTimestamp(task.startDate);
      const taskEnd = task.endDate ? convertDateStringToUnixTimestamp(task.endDate) : null;
      return (
        (!startDateTs || !taskStart || taskStart >= startDateTs) &&
        (!endDateTs || !taskEnd || taskEnd <= endDateTs) &&
        (!description ||
          !description.trim().length ||
          task.description.toLocaleLowerCase().includes(description.toLocaleLowerCase()))
      );
    });

    setFilteredTasks(filtered);
    setTasksOnPage(filtered.slice(0, items_per_page));
  };

  const handleStartDateFiltering = (date: Nullable<string | Date | Date[]>) => {
    if (date && typeof date === 'object' && !Array.isArray(date)) {
      setStartDateFilter(date);
      handleTaskFiltering(date, endDateFilter, searchDescriptionValue);
    }
  };

  const handleEndDateFiltering = (date: Nullable<string | Date | Date[]>) => {
    if (date && typeof date === 'object' && !Array.isArray(date)) {
      setEndDateFilter(date);
      handleTaskFiltering(startDateFilter, date, searchDescriptionValue);
    }
  };

  const handleDescriptionFiltering = (description: string) => {
    setSearchDescriptionValue(description);
    handleTaskFiltering(startDateFilter, endDateFilter, description);
  };

  return (
    <Layout activePage={pages.HISTORY} showToastMessage={showToastMessage}>
      <div className={styles.wrapper}>
        <h1>
          <CalendarIcon />
          <span>Trackers History</span>
        </h1>
        <SearchHistory
          className={styles.filters}
          startDate={startDateFilter}
          endDate={endDateFilter}
          searchDescriptionValue={searchDescriptionValue}
          onSearchDescriptionChange={handleDescriptionFiltering}
          onStartDateChange={handleStartDateFiltering}
          onEndDateChange={handleEndDateFiltering}
          onResetDescriptionFilterClick={() => handleDescriptionFiltering('')}
        />
        <Table
          className={styles.table}
          rowOptions={{ canStart: false, canStop: false, canDelete: true, canEdit: true }}
          data={tasksOnPage.map(t => {
            return {
              ...t,
              isActive: activeTask?.uid === t.uid,
              isEdited: taskToEdit?.uid === t.uid,
              duration: formatSecondsToHMS(t.loggedSeconds),
              isTaskDeleteInProgress: loading.taksDelete && t.uid === loading.deletedTaskUid,
              isTaskDescriptionUpdateInProgress: loading.taskDescriptionUpdate && taskToEdit.uid === t.uid,
            };
          })}
          onClick={handleTaskAction}
          onTaskDescriptionUpdate={handleUpdateTaskDescription}
          onTaskDescriptionCancel={handleCancelTaskDescription}
        />
        <Paging totalRecords={totalCompletedTasksCount} className={styles.paging} onChange={handlePageChange} />
      </div>
    </Layout>
  );
}
