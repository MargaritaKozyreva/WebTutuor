declare 
sowner varchar2(32);
stmt varchar2(4000);
idx INTEGER;
BEGIN

sowner:='SPXML';
idx := 1;

FOR x IN (
SELECT table_name FROM all_tables WHERE not table_name like '%s' and not table_name like '(%' and not table_name like 'common.%'
and nested='NO' and secondary='N' and OWNER=sowner)
	LOOP    
  
  stmt:= 'BEGIN
    DBMS_OUTPUT.PUT_LINE(''Creating index:' || x.table_name || ''');
    execute immediate(''create index idx_ft_' || idx || ' on ' || sowner || '."' || x.table_name || '" ("data")  indextype is ctxsys.context'');    
    
    DBMS_OUTPUT.PUT_LINE(''Index created:' || x.table_name || ''');
    EXCEPTION
         WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE(''Error dropping index:' || x.table_name || '''); 
END;';              
    EXECUTE IMMEDIATE stmt;        
        
    idx:=idx+1;
    
	END LOOP;  
    
END;