DECLARE @RutaArchivo NVARCHAR(500) = '/var/teinsa/unibank-validator-server/archive/data/236/20250919/AT10.txt';
DECLARE @TablaDestino NVARCHAR(128) = 'TH_ATOMO_LIQUIDEZ_SEMANAL_TEMP';
DECLARE @SchemaDestino NVARCHAR(128) = 'dbo';
DECLARE @Separador CHAR(1) = '~';

-- Construir lista de columnas y esquema
DECLARE @ColsInsert NVARCHAR(MAX);
DECLARE @ColsSchema NVARCHAR(MAX);

SELECT
    @ColsInsert = STRING_AGG(QUOTENAME(name), ','),
    @ColsSchema = STRING_AGG(
            QUOTENAME(name) + ' ' +
            CASE
                WHEN TYPE_NAME(system_type_id) IN ('nvarchar','nchar')
                    THEN TYPE_NAME(system_type_id) + '(' + IIF(max_length=-1,'MAX',CAST(max_length/2 AS VARCHAR)) + ')'
                WHEN TYPE_NAME(system_type_id) IN ('varchar','char')
                    THEN TYPE_NAME(system_type_id) + '(' + IIF(max_length=-1,'MAX',CAST(max_length AS VARCHAR)) + ')'
                WHEN TYPE_NAME(system_type_id) IN ('decimal','numeric')
                    THEN TYPE_NAME(system_type_id) + '(' + CAST(precision AS VARCHAR) + ',' + CAST(scale AS VARCHAR) + ')'
                ELSE TYPE_NAME(system_type_id)
                END
        , ',')
FROM sys.columns
WHERE object_id = OBJECT_ID(QUOTENAME(@SchemaDestino) + '.' + QUOTENAME(@TablaDestino));

-- Construir comando dinámico
DECLARE @SQL NVARCHAR(MAX) = N'
INSERT INTO ' + QUOTENAME(@SchemaDestino) + '.' + QUOTENAME(@TablaDestino) + '(' + @ColsInsert + N')
SELECT ' + @ColsInsert + N'
FROM OPENROWSET(
        BULK ''' + @RutaArchivo + N''',
		FORMAT = ''CSV'',
        DATAFILETYPE = ''char'',
        FIELDTERMINATOR = ''' + @Separador + N''',
        ROWTERMINATOR = ''0x0A'',
        FIRSTROW = 1
  ) WITH (' + @ColsSchema + N') AS Import;

';

PRINT @SQL;
EXEC sys.sp_executesql @SQL;