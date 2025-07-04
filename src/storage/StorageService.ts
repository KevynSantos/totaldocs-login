// src/services/StorageService.ts

class StorageService {
  // Salva valor (objeto ou string)
  set(key: string, value: unknown): void {
    try {
      const data = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, data);
    } catch (err) {
      console.error(`Erro ao salvar ${key} no localStorage:`, err);
    }
  }

  // Recupera valor (tenta fazer o parse para JSON)
  get<T = unknown>(key: string): T | string | null {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;
      try {
        return JSON.parse(value) as T;
      } catch {
        return value;
      }
    } catch (err) {
      console.error(`Erro ao ler ${key} do localStorage:`, err);
      return null;
    }
  }

  // Remove item
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Erro ao remover ${key} do localStorage:`, err);
    }
  }

  // Limpa tudo
  clear(): void {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('Erro ao limpar o localStorage:', err);
    }
  }
}

export default new StorageService();
