// useUserDB.ts
import { getNativeItem, updateNativeItem } from "./dbUtils"; // Adjust the path as needed

const useUserDB = () => {
  const getAppCache = async (key: IDBValidKey): Promise<any> =>
    await getNativeItem("cmpdb", "cmp", key);

  const updateAppCache = async (user: any) =>
    await updateNativeItem("cmpdb", "cmp", user);

  return { getAppCache, updateAppCache };
};

export default useUserDB;
