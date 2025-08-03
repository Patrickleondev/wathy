import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Table, Key, Database, Eye, Search, User } from 'lucide-react';

interface SchemaItem {
  name: string;
  type: 'schema' | 'table' | 'column';
  dataType?: string;
  nullable?: boolean;
  primaryKey?: boolean;
  children?: SchemaItem[];
}

interface OracleUser2 {
  USERNAME: string;
  ACCOUNT_STATUS: string;
  CREATED_DATE: string;
  EXPIRY_DATE?: string;
  PROFILE: string;
  AUTHENTICATION_TYPE: string;
  DEFAULT_TABLESPACE: string;
  TEMPORARY_TABLESPACE: string;
}

// 1. Définis le type et les données
interface OracleTableInfo {
  OWNER: string;
  TABLE_NAME: string;
  TABLESPACE_NAME: string;
  STATUS: string;
  NUM_ROWS: string;
  AVG_ROW_LEN: string;
  BLOCKS: string;
  EMPTY_BLOCKS: string;
  AVG_SPACE: string;
  CHAIN_CNT: string;
  LAST_ANALYZED: string;
  PARTITIONED: string;
  TEMPORARY: string;
  SECONDARY: string;
  NESTED: string;
}

const SchemaExplorer: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [filterTablespace, setFilterTablespace] = useState('Tous');
  const [filterOwner, setFilterOwner] = useState('Tous');
  
  const schemaData: SchemaItem[] = [
    {
      name: 'Tablespaces',
      type: 'schema',
      children: [
        {
          name: 'LAB01_IAS_OPSS',
          type: 'table',
          children: [
            { name: 'Type: Permanent', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 60 MB', type: 'column' },
            { name: 'Free: 6 MB', type: 'column' },
            { name: 'Used: 54 MB', type: 'column' },
            { name: '% Used: 90%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
        {
          name: 'LAB01_IAS_TEMP',
          type: 'table',
          children: [
            { name: 'Type: Temporary', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 100 MB', type: 'column' },
            { name: 'Free: 100 MB', type: 'column' },
            { name: 'Used: 0 MB', type: 'column' },
            { name: '% Used: 0%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
        {
          name: 'LAB01_IAS_UMS',
          type: 'table',
          children: [
            { name: 'Type: Permanent', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 100 MB', type: 'column' },
            { name: 'Free: 92 MB', type: 'column' },
            { name: 'Used: 8 MB', type: 'column' },
            { name: '% Used: 8%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
        {
          name: 'LAB01_IAU',
          type: 'table',
          children: [
            { name: 'Type: Permanent', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 60 MB', type: 'column' },
            { name: 'Free: 59 MB', type: 'column' },
            { name: 'Used: 1 MB', type: 'column' },
            { name: '% Used: 2%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
        {
          name: 'LAB01_MDS',
          type: 'table',
          children: [
            { name: 'Type: Permanent', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 100 MB', type: 'column' },
            { name: 'Free: 90 MB', type: 'column' },
            { name: 'Used: 10 MB', type: 'column' },
            { name: '% Used: 10%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
        {
          name: 'LAB01_STB',
          type: 'table',
          children: [
            { name: 'Type: Permanent', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 10 MB', type: 'column' },
            { name: 'Free: 8 MB', type: 'column' },
            { name: 'Used: 2 MB', type: 'column' },
            { name: '% Used: 19%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
        {
          name: 'LAB01_WLS',
          type: 'table',
          children: [
            { name: 'Type: Permanent', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 60 MB', type: 'column' },
            { name: 'Free: 59 MB', type: 'column' },
            { name: 'Used: 1 MB', type: 'column' },
            { name: '% Used: 2%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
        {
          name: 'SMART2D_TBS',
          type: 'table',
          children: [
            { name: 'Type: Permanent', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 3 GB', type: 'column' },
            { name: 'Free: 2.7 GB', type: 'column' },
            { name: 'Used: 311 MB', type: 'column' },
            { name: '% Used: 10%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
        {
          name: 'SYSAUX',
          type: 'table',
          children: [
            { name: 'Type: Permanent', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 620 MB', type: 'column' },
            { name: 'Free: 34 MB', type: 'column' },
            { name: 'Used: 586 MB', type: 'column' },
            { name: '% Used: 95%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
        {
          name: 'SYSTEM',
          type: 'table',
          children: [
            { name: 'Type: Permanent', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 460 MB', type: 'column' },
            { name: 'Free: 4 MB', type: 'column' },
            { name: 'Used: 456 MB', type: 'column' },
            { name: '% Used: 99%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
        {
          name: 'TEMP',
          type: 'table',
          children: [
            { name: 'Type: Temporary', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 157 MB', type: 'column' },
            { name: 'Free: 157 MB', type: 'column' },
            { name: 'Used: 0 MB', type: 'column' },
            { name: '% Used: 0%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
        {
          name: 'UNDOTBS1',
          type: 'table',
          children: [
            { name: 'Type: Undo', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 230 MB', type: 'column' },
            { name: 'Free: 202 MB', type: 'column' },
            { name: 'Used: 28 MB', type: 'column' },
            { name: '% Used: 12%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
        {
          name: 'UNDOTBS3',
          type: 'table',
          children: [
            { name: 'Type: Undo', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 2 GB', type: 'column' },
            { name: 'Free: 1.98 GB', type: 'column' },
            { name: 'Used: 19 MB', type: 'column' },
            { name: '% Used: 1%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
        {
          name: 'USERS',
          type: 'table',
          children: [
            { name: 'Type: Permanent', type: 'column' },
            { name: 'Status: Online', type: 'column' },
            { name: 'Size: 23 MB', type: 'column' },
            { name: 'Free: 21 MB', type: 'column' },
            { name: 'Used: 1 MB', type: 'column' },
            { name: '% Used: 5%', type: 'column' },
            { name: 'Max Size: 32 GB', type: 'column' },
            { name: 'Block Size: 8192', type: 'column' },
            { name: 'BigFile: No', type: 'column' },
            { name: 'Extent Manage: Local', type: 'column' },
          ],
        },
      ],
    },
  ];

  const oracleUsers2: OracleUser2[] = [
    { USERNAME: "TESTCON", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-07-14", EXPIRY_DATE: "2026-01-17 11:30:20", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "SMART2DLK", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-06-16", EXPIRY_DATE: "2025-12-13 11:22:03", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "TEST", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-06-10", EXPIRY_DATE: "2026-01-17 10:41:56", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "IA_AUDIT", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-06-02", EXPIRY_DATE: "2025-11-29 6:21:19", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "C##MONITORING", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-02-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "DBSAT_USER", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-02-05", EXPIRY_DATE: "2025-08-04 10:09:47", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "SMART2D_TBS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "VROMUALD", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-02-04", EXPIRY_DATE: "2025-08-03 5:43:37", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "LAB01_OPSS", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-01-24", EXPIRY_DATE: "2025-07-23 5:34:20", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "LAB01_IAS_OPSS", TEMPORARY_TABLESPACE: "LAB01_IAS_TEMP" },
    { USERNAME: "LAB01_IAU", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-01-24", EXPIRY_DATE: "2025-07-23 5:34:02", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "LAB01_IAU", TEMPORARY_TABLESPACE: "LAB01_IAS_TEMP" },
    { USERNAME: "LAB01_UMS", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-01-24", EXPIRY_DATE: "2025-07-23 5:33:43", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "LAB01_IAS_UMS", TEMPORARY_TABLESPACE: "LAB01_IAS_TEMP" },
    { USERNAME: "LAB01_WLS_RUNTIME", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-01-24", EXPIRY_DATE: "2025-07-23 5:33:27", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "LAB01_WLS", TEMPORARY_TABLESPACE: "LAB01_IAS_TEMP" },
    { USERNAME: "LAB01_WLS", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-01-24", EXPIRY_DATE: "2025-07-23 5:33:27", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "LAB01_WLS", TEMPORARY_TABLESPACE: "LAB01_IAS_TEMP" },
    { USERNAME: "LAB01_MDS", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-01-24", EXPIRY_DATE: "2025-07-23 5:33:11", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "LAB01_MDS", TEMPORARY_TABLESPACE: "LAB01_IAS_TEMP" },
    { USERNAME: "LAB01_IAU_VIEWER", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-01-24", EXPIRY_DATE: "2025-07-23 5:33:02", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "LAB01_IAU", TEMPORARY_TABLESPACE: "LAB01_IAS_TEMP" },
    { USERNAME: "LAB01_IAU_APPEND", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-01-24", EXPIRY_DATE: "2025-07-23 5:32:53", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "LAB01_IAU", TEMPORARY_TABLESPACE: "LAB01_IAS_TEMP" },
    { USERNAME: "LAB01_STB", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-01-24", EXPIRY_DATE: "2025-07-23 5:32:42", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "LAB01_STB", TEMPORARY_TABLESPACE: "LAB01_IAS_TEMP" },
    { USERNAME: "C##TESTS", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2025-01-10", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "SMART2DADMIN", ACCOUNT_STATUS: "EXPIRED", CREATED_DATE: "2024-12-13", EXPIRY_DATE: "2025-06-18 11:20:01", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "SMART2D_TBS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "RJB", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2024-12-10", EXPIRY_DATE: "2025-06-15 16:53:44", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "SMART2DSECU", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2024-12-10", EXPIRY_DATE: "2025-10-14 11:06:06", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "SMART2D_TBS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "C##TEST01", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2024-11-26", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "C##TEST", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2024-07-22", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "USER_TEST", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2024-06-14", EXPIRY_DATE: "2024-12-11 16:48:35", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "HR", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2024-06-06", EXPIRY_DATE: "2025-06-04 10:22:05", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "PDBADMIN", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2024-06-06", EXPIRY_DATE: "2024-12-03 18:17:22", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "DVF", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "DVSYS", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "LBACSYS", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "SYSTEM", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "MDDATA", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "OLAPSYS", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "SI_INFORMTN_SCHEMA", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "ORDPLUGINS", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "ORDDATA", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "ORDSYS", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "MDSYS", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "CTXSYS", ACCOUNT_STATUS: "EXPIRED & LOCKED", CREATED_DATE: "2019-04-17", EXPIRY_DATE: "2024-06-06 18:17:23", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "OJVMSYS", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "WMSYS", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "XDB", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "ANONYMOUS", ACCOUNT_STATUS: "EXPIRED & LOCKED", CREATED_DATE: "2019-04-17", EXPIRY_DATE: "2019-04-17 2:04:18", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "GGSYS", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "GSMCATUSER", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "APPQOSSYS", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "DBSNMP", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "SYS$UMF", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "ORACLE_OCM", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "DBSFWUSER", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "REMOTE_SCHEDULER_AGENT", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "XS$NULL", ACCOUNT_STATUS: "EXPIRED & LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "SYSTEM", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "DIP", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "GSMADMIN_INTERNAL", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "SYSAUX", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "GSMUSER", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "OUTLN", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "SYSTEM", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "SYSRAC", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "SYSKM", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "SYSDG", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "SYSBACKUP", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "SYSTEM", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "SYSTEM", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "AUDSYS", ACCOUNT_STATUS: "LOCKED", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "NONE", DEFAULT_TABLESPACE: "USERS", TEMPORARY_TABLESPACE: "TEMP" },
    { USERNAME: "SYS", ACCOUNT_STATUS: "OPEN", CREATED_DATE: "2019-04-17", PROFILE: "DEFAULT", AUTHENTICATION_TYPE: "PASSWORD", DEFAULT_TABLESPACE: "SYSTEM", TEMPORARY_TABLESPACE: "TEMP" },
  ];

  const oracleTableInfos: OracleTableInfo[] = [
    { OWNER: "APPQOSSYS", TABLE_NAME: "WLM_CLASSIFIER_PLAN", TABLESPACE_NAME: "SYSAUX", STATUS: "VALID", NUM_ROWS: "0", AVG_ROW_LEN: "0", BLOCKS: "0", EMPTY_BLOCKS: "0", AVG_SPACE: "0", CHAIN_CNT: "0", LAST_ANALYZED: "2019-04-17 01:33:13", PARTITIONED: "NO", TEMPORARY: "N", SECONDARY: "N", NESTED: "NO" },
    { OWNER: "SYS", TABLE_NAME: "AUD$", TABLESPACE_NAME: "SYSTEM", STATUS: "VALID", NUM_ROWS: "100", AVG_ROW_LEN: "120", BLOCKS: "10", EMPTY_BLOCKS: "2", AVG_SPACE: "50", CHAIN_CNT: "1", LAST_ANALYZED: "2025-07-01 10:00:00", PARTITIONED: "NO", TEMPORARY: "N", SECONDARY: "N", NESTED: "NO" },
    { OWNER: "HR", TABLE_NAME: "EMPLOYEES", TABLESPACE_NAME: "SYSAUX", STATUS: "VALID", NUM_ROWS: "25", AVG_ROW_LEN: "80", BLOCKS: "5", EMPTY_BLOCKS: "1", AVG_SPACE: "20", CHAIN_CNT: "0", LAST_ANALYZED: "2025-07-10 09:30:00", PARTITIONED: "NO", TEMPORARY: "N", SECONDARY: "N", NESTED: "NO" },
    { OWNER: "SMART2DADMIN", TABLE_NAME: "CONFIG", TABLESPACE_NAME: "SMART2D_TBS", STATUS: "VALID", NUM_ROWS: "5", AVG_ROW_LEN: "200", BLOCKS: "1", EMPTY_BLOCKS: "0", AVG_SPACE: "5", CHAIN_CNT: "0", LAST_ANALYZED: "2025-07-20 14:15:00", PARTITIONED: "NO", TEMPORARY: "N", SECONDARY: "N", NESTED: "NO" },
    { OWNER: "LAB01_OPSS", TABLE_NAME: "SECURITY", TABLESPACE_NAME: "LAB01_IAS_OPSS", STATUS: "VALID", NUM_ROWS: "50", AVG_ROW_LEN: "150", BLOCKS: "8", EMPTY_BLOCKS: "1", AVG_SPACE: "30", CHAIN_CNT: "2", LAST_ANALYZED: "2025-07-25 16:45:00", PARTITIONED: "NO", TEMPORARY: "N", SECONDARY: "N", NESTED: "NO" },
    { OWNER: "LAB01_IAU", TABLE_NAME: "AUDIT_LOG", TABLESPACE_NAME: "LAB01_IAU", STATUS: "VALID", NUM_ROWS: "200", AVG_ROW_LEN: "100", BLOCKS: "20", EMPTY_BLOCKS: "3", AVG_SPACE: "60", CHAIN_CNT: "5", LAST_ANALYZED: "2025-07-26 11:00:00", PARTITIONED: "NO", TEMPORARY: "N", SECONDARY: "N", NESTED: "NO" },
    { OWNER: "LAB01_MDS", TABLE_NAME: "METADATA", TABLESPACE_NAME: "LAB01_MDS", STATUS: "VALID", NUM_ROWS: "80", AVG_ROW_LEN: "90", BLOCKS: "7", EMPTY_BLOCKS: "2", AVG_SPACE: "25", CHAIN_CNT: "1", LAST_ANALYZED: "2025-07-27 09:00:00", PARTITIONED: "NO", TEMPORARY: "N", SECONDARY: "N", NESTED: "NO" },
    { OWNER: "LAB01_STB", TABLE_NAME: "STAGING", TABLESPACE_NAME: "LAB01_STB", STATUS: "VALID", NUM_ROWS: "30", AVG_ROW_LEN: "110", BLOCKS: "3", EMPTY_BLOCKS: "0", AVG_SPACE: "10", CHAIN_CNT: "0", LAST_ANALYZED: "2025-07-27 10:00:00", PARTITIONED: "NO", TEMPORARY: "N", SECONDARY: "N", NESTED: "NO" },
    { OWNER: "LAB01_WLS", TABLE_NAME: "WEBLOGIC", TABLESPACE_NAME: "LAB01_WLS", STATUS: "VALID", NUM_ROWS: "60", AVG_ROW_LEN: "130", BLOCKS: "6", EMPTY_BLOCKS: "1", AVG_SPACE: "15", CHAIN_CNT: "1", LAST_ANALYZED: "2025-07-27 11:00:00", PARTITIONED: "NO", TEMPORARY: "N", SECONDARY: "N", NESTED: "NO" },
    { OWNER: "USERS", TABLE_NAME: "USER_DATA", TABLESPACE_NAME: "USERS", STATUS: "VALID", NUM_ROWS: "10", AVG_ROW_LEN: "70", BLOCKS: "2", EMPTY_BLOCKS: "0", AVG_SPACE: "8", CHAIN_CNT: "0", LAST_ANALYZED: "2025-07-27 12:00:00", PARTITIONED: "NO", TEMPORARY: "N", SECONDARY: "N", NESTED: "NO" },
  ];

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderSchemaItem = (item: SchemaItem, level: number = 0): React.ReactNode => {
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;
    
    const getIcon = () => {
      switch (item.type) {
        case 'schema':
          return <Database className="h-4 w-4 text-blue-500" />;
        case 'table':
          return <Table className="h-4 w-4 text-emerald-500" />;
        case 'column':
          return item.primaryKey 
            ? <Key className="h-4 w-4 text-amber-500" />
            : <Eye className="h-4 w-4 text-gray-400" />;
        default:
          return null;
      }
    };

    return (
      <div key={item.name} className="group">
        <div 
          className="flex items-center space-x-2 p-2 hover:bg-gray-800/50 rounded-lg cursor-pointer transition-all duration-200"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => hasChildren && toggleExpand(item.name)}
        >
          {hasChildren && (
            <span className="text-gray-400 hover:text-gray-300 transition-colors">
              {isExpanded 
                ? <ChevronDown className="h-4 w-4" />
                : <ChevronRight className="h-4 w-4" />
              }
            </span>
          )}
          {!hasChildren && <div className="w-4" />}
          
          {getIcon()}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium truncate ${
                  item.type === 'schema' ? 'text-blue-400' : 
                  item.type === 'table' ? 'text-emerald-400' : 
                  'text-gray-300'
                } group-hover:text-white transition-colors`}>
                {item.name}
              </span>
              {item.dataType && (
                  <span className="text-xs text-gray-500 group-hover:text-gray-400">
                    {item.dataType}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                  {item.primaryKey && (
                  <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded-full">
                    PK
                  </span>
                  )}
                  {item.nullable === false && (
                  <span className="px-1.5 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-full">
                    NOT NULL
                  </span>
                  )}
                </div>
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="border-l border-gray-700/50 ml-4 my-1">
            {item.type === 'table' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
                {item.children!.map(child => (
                  <div
                    key={child.name}
                    className="flex items-center space-x-2 p-2 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    {getIcon()}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 truncate">
                    {child.name}
                  </span>
                        {child.dataType && (
                          <span className="text-xs text-gray-500">
                            {child.dataType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              item.children!.map(child => renderSchemaItem(child, level + 1))
            )}
          </div>
        )}
      </div>
    );
  };

  // Regroupe les tables par tablespace
  const tablesByTablespace: { [tablespace: string]: OracleTableInfo[] } = {};
  oracleTableInfos.forEach(table => {
    if (!tablesByTablespace[table.TABLESPACE_NAME]) {
      tablesByTablespace[table.TABLESPACE_NAME] = [];
    }
    tablesByTablespace[table.TABLESPACE_NAME].push(table);
  });

  // Filtre les tables en fonction de la recherche et des filtres
  const filteredTables = oracleTableInfos.filter(table => {
    const matchesSearch = 
      table.TABLE_NAME.toLowerCase().includes(search.toLowerCase()) ||
      table.OWNER.toLowerCase().includes(search.toLowerCase());
    const matchesTablespace = filterTablespace === 'Tous' || table.TABLESPACE_NAME === filterTablespace;
    const matchesOwner = filterOwner === 'Tous' || table.OWNER === filterOwner;
    return matchesSearch && matchesTablespace && matchesOwner;
  });

  const tablespaceOptions = ['Tous', ...new Set(oracleTableInfos.map(table => table.TABLESPACE_NAME))];
  const ownerOptions = ['Tous', ...new Set(oracleTableInfos.map(table => table.OWNER))];

  return (
    <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 flex flex-row min-h-[700px]">
      {/* Sidebar navigation */}
      <div className="w-64 bg-gray-800/80 border-r border-gray-700/50 p-4 overflow-y-auto flex flex-col gap-6">
        {/* Schemas */}
        <div>
          <h4 className="text-base font-semibold text-white mb-2 flex items-center">
            <Database className="h-4 w-4 text-blue-400 mr-2" />
            Schémas
          </h4>
          <ul>
            {[...new Set(oracleTableInfos.map(t => t.OWNER))].map(owner => (
              <li key={owner} className="px-2 py-1 text-sm text-gray-300 rounded hover:bg-blue-900/30 cursor-pointer">
                {owner}
              </li>
            ))}
          </ul>
        </div>
        {/* Tablespaces */}
        <div>
          <h4 className="text-base font-semibold text-white mb-2 flex items-center">
            <Database className="h-4 w-4 text-blue-400 mr-2" />
            Tablespaces
          </h4>
          <ul>
            {[...new Set(oracleTableInfos.map(t => t.TABLESPACE_NAME))].map(ts => (
              <li key={ts} className="px-2 py-1 text-sm text-gray-300 rounded hover:bg-emerald-900/30 cursor-pointer">
                {ts}
              </li>
            ))}
          </ul>
        </div>
        {/* Tables */}
        <div>
          <h4 className="text-base font-semibold text-white mb-2 flex items-center">
            <Table className="h-4 w-4 text-emerald-400 mr-2" />
            Tables
          </h4>
          <ul>
            {oracleTableInfos.map(table => (
              <li key={table.TABLE_NAME} className="px-2 py-1 text-sm text-gray-300 rounded hover:bg-gray-700/40 cursor-pointer">
                {table.TABLE_NAME}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h3 className="text-xl font-semibold text-white flex items-center mb-6">
          <Database className="h-6 w-6 text-blue-500 mr-2" />
          Vue façon Toad : Tables, Tablespaces, Schémas
        </h3>
        {/* --- NOUVEL AFFICHAGE MODERNE --- */}
        {/* Section Tablespaces */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2" /> Tablespaces
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schemaData[0].children?.map(ts => (
              <div key={ts.name} className="bg-blue-900/30 border border-blue-700 rounded-xl p-4 shadow hover:shadow-lg transition">
              <div className="flex items-center mb-2">
                  <Database className="h-5 w-5 text-blue-300 mr-2" />
                  <span className="font-semibold text-blue-200 text-lg">{ts.name}</span>
                </div>
                <ul className="text-sm text-blue-100 space-y-1">
                  {ts.children?.map(attr => (
                    <li key={attr.name} className="flex items-center">
                      <span className="mr-2">•</span> {attr.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Section Utilisateurs */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" /> Utilisateurs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {oracleUsers2.map(user => (
              <div key={user.USERNAME} className="bg-emerald-900/30 border border-emerald-700 rounded-xl p-4 shadow hover:shadow-lg transition">
                <div className="flex items-center mb-2">
                  <User className="h-5 w-5 text-emerald-300 mr-2" />
                  <span className="font-semibold text-emerald-200 text-lg">{user.USERNAME}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${user.ACCOUNT_STATUS === 'OPEN' ? 'bg-emerald-700 text-emerald-100' : 'bg-red-700 text-red-100'}`}>{user.ACCOUNT_STATUS}</span>
                </div>
                <div className="text-xs text-emerald-100 mb-1">Créé le : {user.CREATED_DATE}</div>
                {user.EXPIRY_DATE && <div className="text-xs text-emerald-200 mb-1">Expire : {user.EXPIRY_DATE}</div>}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-emerald-800/60 px-2 py-0.5 rounded text-xs">Profil : {user.PROFILE}</span>
                  <span className="bg-emerald-800/60 px-2 py-0.5 rounded text-xs">Auth : {user.AUTHENTICATION_TYPE}</span>
                  <span className="bg-emerald-800/60 px-2 py-0.5 rounded text-xs">Tablespace : {user.DEFAULT_TABLESPACE}</span>
                  <span className="bg-emerald-800/60 px-2 py-0.5 rounded text-xs">Temp : {user.TEMPORARY_TABLESPACE}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Section Tables */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center">
            <Table className="h-5 w-5 mr-2" /> Tables
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {oracleTableInfos.map(table => (
              <div key={table.TABLE_NAME} className="bg-purple-900/30 border border-purple-700 rounded-xl p-4 shadow hover:shadow-lg transition">
                <div className="flex items-center mb-2">
                  <Table className="h-5 w-5 text-purple-300 mr-2" />
                  <span className="font-semibold text-purple-200 text-lg">{table.TABLE_NAME}</span>
                  <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-blue-800 text-blue-100">{table.TABLESPACE_NAME}</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${table.STATUS === 'VALID' ? 'bg-emerald-700 text-emerald-100' : 'bg-red-700 text-red-100'}`}>{table.STATUS}</span>
                </div>
                <div className="text-xs text-purple-100 mb-1">Propriétaire : {table.OWNER}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-purple-800/60 px-2 py-0.5 rounded text-xs">Lignes : {table.NUM_ROWS}</span>
                  <span className="bg-purple-800/60 px-2 py-0.5 rounded text-xs">Taille bloc : {table.AVG_ROW_LEN}</span>
                  <span className="bg-purple-800/60 px-2 py-0.5 rounded text-xs">Dernière analyse : {table.LAST_ANALYZED}</span>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaExplorer;