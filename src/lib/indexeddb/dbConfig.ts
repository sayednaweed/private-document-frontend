// dbConfig.ts
export interface DBConfig {
  name: string;
  version: number;
}

export const dbConfigs: { [key: string]: DBConfig } = {
  cmpdb: { name: "cmpdb", version: 1 },
  cdb: { name: "cdb", version: 1 },
};
