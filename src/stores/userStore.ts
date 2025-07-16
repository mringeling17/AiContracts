import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  index: number;
  name: string;
  address: string;
  emoji: string;
  color: string;
}

interface UserStore {
  currentUser: User | null;
  isUserSelected: boolean;
  setCurrentUser: (user: User) => void;
  clearCurrentUser: () => void;
  loadUserFromStorage: () => void;
}

// Mock users data from Hardhat's default accounts
export const mockUsers: User[] = [
  {
    index: 0,
    name: 'Alice',
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    emoji: '👩‍💼',
    color: 'blue'
  },
  {
    index: 1,
    name: 'Bob',
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    emoji: '👨‍💻',
    color: 'green'
  },
  {
    index: 2,
    name: 'Charlie',
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    emoji: '👨‍🎨',
    color: 'purple'
  },
  {
    index: 3,
    name: 'Dave',
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    emoji: '👨‍🔬',
    color: 'orange'
  },
  {
    index: 4,
    name: 'Eve',
    address: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    emoji: '👩‍🎨',
    color: 'pink'
  },
  {
    index: 5,
    name: 'Frank',
    address: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    emoji: '👨‍🍳',
    color: 'red'
  }
];

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isUserSelected: false,
      
      setCurrentUser: (user: User) => {
        set({ currentUser: user, isUserSelected: true });
      },
      
      clearCurrentUser: () => {
        set({ currentUser: null, isUserSelected: false });
      },
      
      loadUserFromStorage: () => {
        // This will be called automatically by zustand persist
        const state = get();
        if (state.currentUser) {
          set({ isUserSelected: true });
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);

// Export individual functions for convenience
export const { setCurrentUser, clearCurrentUser, loadUserFromStorage } = useUserStore.getState();