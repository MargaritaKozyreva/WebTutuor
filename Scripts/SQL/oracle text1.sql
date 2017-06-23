-- Обновление полнотекстового поиска ORACLE

-- Вот какие скрипты могут помочь, обновлять полнотекстовый индекс в oracle

-- Скрипты приведены для запуска из под пользователя с расширенными правами (например: system, sys)

-- 1. Перестройка индексов

DECLARE
owner varchar(32);
BEGIN
owner:='SPXML_272'; -- put your own schema user here
DBMS_OUTPUT.PUT_LINE('start');
FOR x IN (SELECT index_name FROM all_indexes WHERE ityp_owner='CTXSYS' and ityp_name='CONTEXT' and TABLE_OWNER=owner)
LOOP

EXECUTE IMMEDIATE '
BEGIN
alter index ' || owner || '."' || x.index_name || '" rebuild; 
EXCEPTION
WHEN OTHERS THEN
DBMS_OUTPUT.PUT_LINE(''Error rebuilding index:' || x.index_name || '''); 
END;'; 

END LOOP;
DBMS_OUTPUT.PUT_LINE('finish');
END;

2. Обновление индексов

declare 
owner varchar(32);
BEGIN

owner:='SPXML_272'; -- put your own schema user here

FOR x IN (SELECT index_name FROM all_indexes WHERE ityp_owner='CTXSYS' and ityp_name='CONTEXT' and TABLE_OWNER=owner)
LOOP 
EXECUTE IMMEDIATE '
BEGIN
ctx_ddl.sync_index(''' || owner || '."' || x.index_name || '"''); 
EXCEPTION
WHEN OTHERS THEN
DBMS_OUTPUT.PUT_LINE(''Error updating index:' || x.index_name || '''); 
END;'; 
END LOOP; 
END;

3. Создание агента (job) по обновление индекса раз в час

BEGIN 
DBMS_SCHEDULER.create_job (
job_name => 'ft_idx_update_spxml_272', -- put your own job name here
job_type => 'PLSQL_BLOCK',
job_action => 'declare 
owner varchar(32);
BEGIN
owner:=''SPXML_272''; -- put your own schema user here
FOR x IN (SELECT index_name FROM all_indexes WHERE ityp_owner=''CTXSYS'' and ityp_name=''CONTEXT'' and TABLE_OWNER=owner)
LOOP 
EXECUTE IMMEDIATE ''
BEGIN
ctx_ddl.sync_index('''''' || owner || ''."'' || x.index_name || ''"''''); 
EXCEPTION
WHEN OTHERS THEN
DBMS_OUTPUT.PUT_LINE(''''Error updating index:'' || x.index_name || ''''''); 
END;',
start_date => SYSTIMESTAMP,
repeat_interval => 'freq=hourly; byminute=0',
end_date => NULL,
enabled => TRUE,
comments => 'Hourly updating full text index.');
end;

/*
BEGIN 
DBMS_SCHEDULER.drop_job ( job_name => 'ft_idx_update_spxml_272',
force=> TRUE );
END;
*/