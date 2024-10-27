// useProductDB.ts
import { useState, useEffect, useCallback } from "react";
import { getDB, addItem } from "./dbUtils"; // Adjust the path as needed

const useProductDB = () => {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const database = await getDB("productDB");
        setDb(database);
      } catch (err) {
        setError(`Failed to open product database: ${(err as Error).message}`);
      }
    };

    initializeDB();
  }, []);

  const getItem = useCallback(
    async (key: IDBValidKey): Promise<any> => {
      if (!db) throw new Error("Product database not initialized");
      return new Promise((resolve, reject) => {
        const transaction = db.transaction("dataStore", "readonly");
        const store = transaction.objectStore("dataStore");
        const request = store.get(key);

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    },
    [db]
  );

  const addProduct = useCallback(async (product: any) => {
    try {
      await addItem("productDB", "dataStore", product);
    } catch (err) {
      setError(`Failed to add product: ${(err as Error).message}`);
    }
  }, []);

  return { getItem, addProduct, error };
};

export default useProductDB;
