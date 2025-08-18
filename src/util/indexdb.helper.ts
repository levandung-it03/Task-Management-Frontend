export class IndexDBHelper {
  static async openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("ReportDB", 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("reports")) {
          db.createObjectStore("reports", { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save a report draft (title & content) for a given reportId.
   */
  static async saveDraft(reportId: string, content: string, title: string = "") {
    const db = await IndexDBHelper.openDb();
    const tx = db.transaction("reports", "readwrite");
    const store = tx.objectStore("reports");
    store.put({ id: reportId, content, title, updatedAt: new Date() });
    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  /**
   * Load a report draft (returns {content, title}) for a given reportId.
   */
  static async loadDraft(reportId: string): Promise<{ content: string; title: string }> {
    const db = await IndexDBHelper.openDb();
    const tx = db.transaction("reports", "readonly");
    const store = tx.objectStore("reports");

    return new Promise((resolve) => {
      const req = store.get(reportId);
      req.onsuccess = () => {
        const result = req.result;
        resolve({
          content: result?.content || "",
          title: result?.title || ""
        });
      };
      req.onerror = () => {
        resolve({ content: "", title: "" });
      };
    });
  }

  /**
   * Remove a report draft for a given reportId.
   */
  static async removeDraft(reportId: string) {
    const db = await IndexDBHelper.openDb();
    const tx = db.transaction("reports", "readwrite");
    const store = tx.objectStore("reports");
    store.delete(reportId);
    return new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
}