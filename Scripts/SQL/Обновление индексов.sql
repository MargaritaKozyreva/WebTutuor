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

-- 2. Обновление индексов

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

-- 3. Создание агента (job) по обновление индекса раз в час

BEGIN
sys.dbms_scheduler.create_job( 
job_name => '"SYS"."ft_idx_update_spxml_272"', -- put your own job name here
job_type => 'PLSQL_BLOCK',
job_action => 'declare 
owner varchar(32); 
ft_sql varchar(4096); 
BEGIN 
owner:=''SPXML_272''; -- put your own schema user here
FOR x IN (SELECT index_name FROM all_indexes WHERE ityp_owner=''CTXSYS'' and ityp_name=''CONTEXT'' and TABLE_OWNER=owner) 
LOOP 
ft_sql:= '' 
DECLARE 
err_msg VARCHAR2(250);
BEGIN 
dbms_system.ksdwrt(2,''''Updating index:'' || x.index_name || '''''');
ctx_ddl.sync_index('''''' || owner || ''."'' || x.index_name || ''"''''); 
dbms_system.ksdwrt(2,''''Index updated:'' || x.index_name || '''''');EXCEPTION 
WHEN OTHERS THEN 
err_msg := SQLERRM; 
dbms_system.ksdwrt(2,''''Error updating index:'' || x.index_name || '''''');
dbms_system.ksdwrt(2,err_msg);
END;
''; 
EXECUTE IMMEDIATE ft_sql;
END LOOP;
END;',
repeat_interval => 'FREQ=HOURLY',
start_date => systimestamp at time zone 'Europe/Moscow',
job_class => '"DEFAULT_JOB_CLASS"',
auto_drop => FALSE,
enabled => FALSE);
sys.dbms_scheduler.set_attribute( name => '"SYS"."ft_idx_update_spxml_272"', attribute => 'job_weight', value => 1); 
sys.dbms_scheduler.enable( '"SYS"."ft_idx_update_spxml_272"' ); 
END;