import axios from "axios"
import { create } from "zustand"

import {
  CreateItemResponse,
  CycleItem,
  CycleItems,
  CycleItemStoreTypes,
} from "../@types/Items/Cycle"
import { BACKEND_URL } from "../constants/urls"

export const useCycleItemStore = create<CycleItemStoreTypes>((set, get) => ({
  cycleItem: null,
  cycleItems: [],
  isLoading: false,
  isFetched: false,
  setCycleItem: (cycleItem: CycleItem | null) => set({ cycleItem }),
  setIsFetched: (isFetched: boolean) => set({ isFetched }),
  fetchInboxItems: async (session: string) => {
    let cycleItems_: CycleItem[] = []
    set({ isLoading: true })
    try {
      const { data } = await axios.get<CycleItems>(
        `${BACKEND_URL}/api/inbox/`,
        {
          headers: { Authorization: `Bearer ${session}` },
        }
      )
      cycleItems_ = data.response
      set({ cycleItems: cycleItems_, isFetched: true })
    } catch (error) {
      console.error("Error fetching cycle items: ", error)
    } finally {
      set({ isLoading: false })
    }
    return cycleItems_
  },
  setCycleItems: (cycleItems: CycleItem[]) => {
    set({ cycleItems })
  },
  fetchTodayItems: async (session: string, date: string) => {
    let cycleItems_: CycleItem[] = []
    set({ isLoading: true })
    try {
      const res = await axios.get(`${BACKEND_URL}/api/${date}`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      })
      cycleItems_ = res.data.response
      console.log("api today items: ", cycleItems_)
      set({ cycleItems: cycleItems_, isFetched: true })
    } catch (error) {
      console.error("error fetching today items: ", error)
    } finally {
      set({ isLoading: false })
    }
    return cycleItems_
  },
  createItem: async (data: Partial<CycleItem>, session: string) => {
    try {
      const response = await axios.post<CreateItemResponse>(
        `${BACKEND_URL}/api/inbox/`,
        data,
        {
          headers: { Authorization: `Bearer ${session}` },
        }
      )
      const newItem = response.data.item
      set((state) => ({ cycleItems: [newItem, ...state.cycleItems] }))
    } catch (error) {
      console.error("Error adding item: ", error)
    }
  },
  mutateItem: async (data: Partial<CycleItem>, session: string, id: string) => {
    try {
      const response = await axios.put<CreateItemResponse>(
        `${BACKEND_URL}/api/inbox/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      )
      const mutatedItem = response.data.item
      set((state) => ({
        cycleItems: [mutatedItem, ...state.cycleItems],
      }))
    } catch (error) {
      console.error("error updating item: ", error)
    }
  },
}))
