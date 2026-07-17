import { FormItemType } from "./index";

/**
 * Mapping from database types to form item types
 * Supports common databases such as MySQL, PostgreSQL, Oracle, SQL Server, SQLite, etc.
 */

// Database type enum (case-insensitive)
export type DatabaseType =
  // String types
  | "VARCHAR"
  | "CHAR"
  | "TEXT"
  | "TINYTEXT"
  | "MEDIUMTEXT"
  | "LONGTEXT"
  | "NVARCHAR"
  | "NCHAR"
  | "NTEXT"
  | "CLOB"
  | "STRING"
  // Numeric types
  | "INT"
  | "INTEGER"
  | "BIGINT"
  | "SMALLINT"
  | "TINYINT"
  | "MEDIUMINT"
  | "DECIMAL"
  | "NUMERIC"
  | "FLOAT"
  | "DOUBLE"
  | "REAL"
  | "NUMBER"
  | "MONEY"
  | "SMALLMONEY"
  // Date/time types
  | "DATE"
  | "TIME"
  | "DATETIME"
  | "TIMESTAMP"
  | "YEAR"
  | "DATETIME2"
  | "SMALLDATETIME"
  | "DATETIMEOFFSET"
  // Boolean types
  | "BOOLEAN"
  | "BOOL"
  | "BIT"
  // Binary types
  | "BLOB"
  | "TINYBLOB"
  | "MEDIUMBLOB"
  | "LONGBLOB"
  | "BINARY"
  | "VARBINARY"
  | "IMAGE"
  | "BYTEA"
  // JSON types
  | "JSON"
  | "JSONB"
  // Other types
  | "UUID"
  | "ENUM"
  | "SET";

/**
 * Mapping table from database types to form item types
 */
export const DATABASE_TYPE_TO_FORM_ITEM_MAP: Record<string, FormItemType> = {
  // ========== String types ==========
  VARCHAR: "INPUT",
  CHAR: "INPUT",
  TEXT: "TEXTAREA",
  TINYTEXT: "TEXTAREA",
  MEDIUMTEXT: "TEXTAREA",
  LONGTEXT: "TEXTAREA",
  NVARCHAR: "INPUT",
  NCHAR: "INPUT",
  NTEXT: "TEXTAREA",
  CLOB: "TEXTAREA",
  STRING: "INPUT",

  // ========== Numeric types ==========
  INT: "INPUTNUMBER",
  INTEGER: "INPUTNUMBER",
  BIGINT: "INPUTNUMBER",
  SMALLINT: "INPUTNUMBER",
  TINYINT: "INPUTNUMBER",
  MEDIUMINT: "INPUTNUMBER",
  DECIMAL: "INPUTNUMBER",
  NUMERIC: "INPUTNUMBER",
  FLOAT: "INPUTNUMBER",
  DOUBLE: "INPUTNUMBER",
  REAL: "INPUTNUMBER",
  NUMBER: "INPUTNUMBER",
  MONEY: "INPUTNUMBER",
  SMALLMONEY: "INPUTNUMBER",

  // ========== Date/time types ==========
  DATE: "DATEPICKER",
  TIME: "DATEPICKER",
  DATETIME: "DATEPICKER",
  TIMESTAMP: "DATEPICKER",
  YEAR: "DATEPICKER",
  DATETIME2: "DATEPICKER",
  SMALLDATETIME: "DATEPICKER",
  DATETIMEOFFSET: "DATEPICKER",

  // ========== Boolean types ==========
  BOOLEAN: "SWITCH",
  BOOL: "SWITCH",
  BIT: "SWITCH",

  // ========== Binary types ==========
  BLOB: "FILE",
  TINYBLOB: "FILE",
  MEDIUMBLOB: "FILE",
  LONGBLOB: "FILE",
  BINARY: "FILE",
  VARBINARY: "FILE",
  IMAGE: "IMAGEFILE",
  BYTEA: "FILE",

  // ========== JSON types ==========
  JSON: "CODEMIRROR",
  JSONB: "CODEMIRROR",

  // ========== Other types ==========
  UUID: "INPUT",
  ENUM: "SELECT",
  SET: "CHECKBOXGROUP",
};

/**
 * Get the corresponding form item type by database type
 * @param databaseType Database type (case-insensitive)
 * @param defaultType Default form item type, returned when no mapping is found
 * @returns Form item type
 */
export function getFormItemTypeByDatabaseType(
  databaseType: string,
  defaultType: FormItemType = "INPUT"
): FormItemType {
  const upperType = databaseType.toUpperCase().trim();

  // Handle types with parentheses, e.g. VARCHAR(255), INT(11), etc.
  const baseType = upperType.split("(")[0].trim();

  return DATABASE_TYPE_TO_FORM_ITEM_MAP[baseType] || defaultType;
}

/**
 * Determine whether TEXTAREA should be used based on database type and length
 * If a string type's length exceeds the threshold, TEXTAREA is recommended
 * @param databaseType Database type
 * @param length Field length
 * @param threshold Threshold, defaults to 255
 * @returns Whether TEXTAREA should be used
 */
export function shouldUseTextarea(
  databaseType: string,
  length?: number,
  threshold: number = 255
): boolean {
  const upperType = databaseType.toUpperCase().trim();
  const baseType = upperType.split("(")[0].trim();

  // If it is already a TEXT type, return true directly
  if (
    ["TEXT", "TINYTEXT", "MEDIUMTEXT", "LONGTEXT", "NTEXT", "CLOB"].includes(
      baseType
    )
  ) {
    return true;
  }

  // If it is a VARCHAR or CHAR type and the length exceeds the threshold, TEXTAREA is recommended
  if (["VARCHAR", "CHAR", "NVARCHAR", "NCHAR"].includes(baseType)) {
    return length ? length > threshold : false;
  }

  return false;
}

/**
 * Get the intelligently recommended form item type by database type
 * Makes a smart decision combining type, length, and other information
 * @param databaseType Database type
 * @param length Field length
 * @returns Recommended form item type
 */
export function getRecommendedFormItemType(
  databaseType: string,
  length?: number
): FormItemType {
  // If the string type has a large length, use TEXTAREA
  if (shouldUseTextarea(databaseType, length)) {
    return "TEXTAREA";
  }

  // Use the base mapping
  return getFormItemTypeByDatabaseType(databaseType);
}

/**
 * Database type categories
 */
export const DATABASE_TYPE_CATEGORIES = {
  STRING: [
    "VARCHAR",
    "CHAR",
    "TEXT",
    "TINYTEXT",
    "MEDIUMTEXT",
    "LONGTEXT",
    "NVARCHAR",
    "NCHAR",
    "NTEXT",
    "CLOB",
    "STRING",
  ],
  NUMBER: [
    "INT",
    "INTEGER",
    "BIGINT",
    "SMALLINT",
    "TINYINT",
    "MEDIUMINT",
    "DECIMAL",
    "NUMERIC",
    "FLOAT",
    "DOUBLE",
    "REAL",
    "NUMBER",
    "MONEY",
    "SMALLMONEY",
  ],
  DATETIME: [
    "DATE",
    "TIME",
    "DATETIME",
    "TIMESTAMP",
    "YEAR",
    "DATETIME2",
    "SMALLDATETIME",
    "DATETIMEOFFSET",
  ],
  BOOLEAN: ["BOOLEAN", "BOOL", "BIT"],
  BINARY: [
    "BLOB",
    "TINYBLOB",
    "MEDIUMBLOB",
    "LONGBLOB",
    "BINARY",
    "VARBINARY",
    "IMAGE",
    "BYTEA",
  ],
  JSON: ["JSON", "JSONB"],
  OTHER: ["UUID", "ENUM", "SET"],
} as const;

/**
 * Get the category of a database type
 * @param databaseType Database type
 * @returns Type category
 */
export function getDatabaseTypeCategory(
  databaseType: string
): keyof typeof DATABASE_TYPE_CATEGORIES | null {
  const upperType = databaseType.toUpperCase().trim();
  const baseType = upperType.split("(")[0].trim();

  for (const [category, types] of Object.entries(DATABASE_TYPE_CATEGORIES)) {
    if (types.includes(baseType as never)) {
      return category as keyof typeof DATABASE_TYPE_CATEGORIES;
    }
  }

  return null;
}

/**
 * Reverse mapping: form item types to recommended database types
 */
export const FORM_ITEM_TO_DATABASE_TYPE_MAP: Partial<
  Record<FormItemType, DatabaseType[]>
> = {
  INPUT: ["VARCHAR", "CHAR", "NVARCHAR", "NCHAR", "STRING", "UUID"],
  TEXTAREA: ["TEXT", "LONGTEXT", "MEDIUMTEXT", "TINYTEXT", "NTEXT", "CLOB"],
  INPUTNUMBER: [
    "INT",
    "INTEGER",
    "BIGINT",
    "SMALLINT",
    "TINYINT",
    "DECIMAL",
    "NUMERIC",
    "FLOAT",
    "DOUBLE",
    "REAL",
    "NUMBER",
  ],
  DATEPICKER: ["DATE", "DATETIME", "TIMESTAMP", "DATETIME2"],
  SWITCH: ["BOOLEAN", "BOOL", "BIT"],
  SELECT: ["ENUM", "VARCHAR", "INT"],
  CHECKBOXGROUP: ["SET", "VARCHAR"],
  FILE: ["BLOB", "BINARY", "VARBINARY", "BYTEA"],
  IMAGEFILE: ["BLOB", "IMAGE", "VARBINARY"],
  CODEMIRROR: ["JSON", "JSONB", "TEXT"],
};
