export interface InboxStoreType {
    inboxItems: InboxItem[];
    todayInboxItems: TodayInboxItem[];
    overdueInboxItems: OverdueInboxItem[]; 
    isFetched: boolean;
    setIsFetched: (isFetched: boolean) => void;
    fetchInboxData: (session: string) => Promise<InboxItem[]>;
    fetchTodayInboxData: (session: string) => Promise<TodayInboxItem[]>;
    fetchOverdueInboxData: (session: string) => Promise<OverdueInboxItem[]>;
    setInboxItems: (inboxItems: InboxItem[]) => void;
    setTodayInboxItems: (todayInboxItems: TodayInboxItem[]) => void;
    setOverdueInboxItems: (overdueInboxItems: OverdueInboxItem[]) => void;
  }
  
  export interface InboxItem {
    uuid: string;
    title?: string;
    type?: string;
    description?: string;
    effort?: string;
    dueDate?: Date;
    id?: string;
    metadata?: any;
    createdAt?: Date;
    updatedAt?: Date;
    pages?: string[];
    user?: string;
    isCompleted?: boolean;
    isArchived?: boolean;
    isDeleted?: boolean;
  }
  
  export interface TodayInboxItem {
      uuid: string;
      title: string;
      type: string;
      date: Date;
      url: string;
      metadata: any;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      pages: string[];
      users: string;
      isArchived: boolean;
      isDeleted: boolean
  }

  export interface OverdueInboxItem {
    uuid: string;
    title: string;
    type: string;
    description: string;
    effort: string;
    dueDate: Date;
    id: string;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
    pages: string[];
    user: string;
    isArchived: boolean;
    isDeleted: boolean;
    isCompleted: boolean;
  }