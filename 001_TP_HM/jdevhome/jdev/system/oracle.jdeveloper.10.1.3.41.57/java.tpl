<?xml version = '1.0' encoding = 'UTF-8'?>
<template langage="java">
   <item>
    <abbr><![CDATA[ltoar]]></abbr>
    <descr><![CDATA[List to array]]></descr>
    <text><![CDATA[$type$ $var$ = new $typeelem$[$list$.size()];
$var$ = ($type$) $list$.toArray($var$);
$end$]]></text>
    <variable>
      <name><![CDATA[list]]></name>
      <type><![CDATA[varOfType(java.util.List)]]></type>
      <value><![CDATA[list]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[type]]></name>
      <type><![CDATA[arrayOf($typeelem$)]]></type>
      <value><![CDATA[Object[]]]></value>
    <editable>false</editable>
  </variable>
  <variable>
    <name><![CDATA[typeelem]]></name>
      <type><![CDATA[smartCollectionContent($list$)]]></type>
      <value><![CDATA[Object]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[var]]></name>
      <type><![CDATA[suggestNameFromType($type$)]]></type>
      <value><![CDATA[var]]></value>
      <editable>true</editable>
    </variable>
  </item>
   <item>
    <abbr><![CDATA[pusfi]]></abbr>
    <descr><![CDATA[public static final int]]></descr>
    <text><![CDATA[public static final int $end$;]]></text>
  </item>
   <item>
    <abbr><![CDATA[pusfb]]></abbr>
    <descr><![CDATA[public static final boolean]]></descr>
    <text><![CDATA[public static final boolean $end$;]]></text>
  </item>
   <item>
    <abbr><![CDATA[pusfs]]></abbr>
    <descr><![CDATA[public static final String]]></descr>
    <text><![CDATA[public static final String $end$;]]></text>
  </item>
   <item>
    <abbr><![CDATA[ritar]]></abbr>
    <descr><![CDATA[Reverse array iterator]]></descr>
    <text><![CDATA[for	(int $i$ = $array$.length; --$i$ >= 0 ;)
{
	$type$ $var$ = $array$[$i$];
	$end$
}]]></text>
    <variable>
      <name><![CDATA[array]]></name>
      <type><![CDATA[arrays]]></type>
      <value><![CDATA[array]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[i]]></name>
      <type><![CDATA[smartIndex]]></type>
      <value><![CDATA[xxxxxxxxx]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[type]]></name>
      <type><![CDATA[elementTypeOf($array$)]]></type>
      <value><![CDATA[Object]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[var]]></name>
      <type><![CDATA[suggestNameFromType($type$)]]></type>
      <value><![CDATA[var]]></value>
      <editable>true</editable>
    </variable>
  </item>
   <item>
    <abbr><![CDATA[ritli]]></abbr>
    <descr><![CDATA[Reverse iteration over a list]]></descr>
    <text><![CDATA[for	(int $i$ = $list$.size(); --$i$ >= 0 ; )
{
	$type$ $var$ = ($type$) $list$.get($i$);
	$end$
}]]></text>
    <variable>
      <name><![CDATA[i]]></name>
      <type><![CDATA[smartIndex]]></type>
      <value><![CDATA[xxxxxxxxxxxx]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[list]]></name>
      <type><![CDATA[varOfType(java.util.List)]]></type>
      <value><![CDATA[list]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[type]]></name>
      <type><![CDATA[smartListContent($list$)]]></type>
      <value><![CDATA[Object]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[var]]></name>
      <type><![CDATA[suggestNameFromType($type$)]]></type>
      <value><![CDATA[var]]></value>
      <editable>true</editable>
    </variable>
  </item>
   <item>
    <abbr><![CDATA[fori]]></abbr>
    <descr><![CDATA[integer based loop]]></descr>
    <text><![CDATA[for (int $i$ = 0; $i$ < $lim$; $i$++) 
{
	$end$
}
]]></text>
    <variable>
      <name><![CDATA[i]]></name>
      <type><![CDATA[smartIndex]]></type>
      <value><![CDATA[i]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[lim]]></name>
      <type><![CDATA[default]]></type>
      <value><![CDATA[0]]></value>
      <editable>true</editable>
    </variable>
  </item>
   <item>
    <abbr><![CDATA[forn]]></abbr>
    <descr><![CDATA[integer based loop]]></descr>
    <text><![CDATA[int $n$ = $lim$;
for (int $i$ = 0; $i$ < $n$; $i$++) 
{
	$end$	
}
]]></text>
    <variable>
      <name><![CDATA[i]]></name>
      <type><![CDATA[smartIndex]]></type>
      <value><![CDATA[i]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[lim]]></name>
      <type><![CDATA[default]]></type>
      <value><![CDATA[0]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[n]]></name>
      <type><![CDATA[suggestNameFromType(int)]]></type>
      <value><![CDATA[n]]></value>
      <editable>true</editable>
    </variable>
  </item>
   <item>
    <abbr><![CDATA[pral]]></abbr>
    <descr><![CDATA[private ArrayList]]></descr>
    <text><![CDATA[private ArrayList _$end$ = new ArrayList();]]></text>
    <import>java.util.ArrayList</import>
  </item>
   <item>
    <abbr><![CDATA[prhm]]></abbr>
    <descr><![CDATA[private HashMap]]></descr>
    <text><![CDATA[private HashMap _$end$ = new HashMap();]]></text>
    <import>java.util.HashMap</import>
  </item>
   <item>
    <abbr><![CDATA[pusf]]></abbr>
    <descr><![CDATA[public static final]]></descr>
    <text><![CDATA[public static final $end$;]]></text>
  </item>
   <item>
    <abbr><![CDATA[main]]></abbr>
    <descr><![CDATA[main method]]></descr>
    <text><![CDATA[public static void main(String[] args)
{
	$end$
}
]]></text>
  </item>
   <item>
    <abbr><![CDATA[outp]]></abbr>
    <descr><![CDATA[out.println()]]></descr>
    <text><![CDATA[out.println($end$);]]></text>
  </item>
   <item>
    <abbr><![CDATA[itmk]]></abbr>
    <descr><![CDATA[Iterate over map keys]]></descr>
    <text><![CDATA[Iterator $iter$ = $map$.keySet().iterator();
while	($iter$.hasNext())
{
	$type$ $var$ = ($type$) $iter$.next();
	$end$
}]]></text>
    <import>java.util.Iterator</import>
    <variable>
      <name><![CDATA[iter]]></name>
      <type><![CDATA[suggestNameFromType(Iterator)]]></type>
      <value><![CDATA[iter]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[map]]></name>
      <type><![CDATA[varOfType(java.util.Map)]]></type>
      <value><![CDATA[map]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[type]]></name>
      <type><![CDATA[smartMapKeys($map$)]]></type>
      <value><![CDATA[Object]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[var]]></name>
      <type><![CDATA[suggestNameFromType($type$)]]></type>
      <value><![CDATA[var]]></value>
      <editable>true</editable>
    </variable>
  </item>
   <item>
    <abbr><![CDATA[itco]]></abbr>
    <descr><![CDATA[Iterate over a collection]]></descr>
    <text><![CDATA[for(Iterator $iter$ = $col$.iterator();$iter$.hasNext();)
{
	$type$ $var$ = ($type$) $iter$.next();
	$end$
}]]></text>
    <import>java.util.Iterator</import>
    <variable>
      <name><![CDATA[col]]></name>
      <type><![CDATA[varOfType(java.util.Collection)]]></type>
      <value><![CDATA[col]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[iter]]></name>
      <type><![CDATA[suggestNameFromType(Iterator)]]></type>
      <value><![CDATA[iter]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[type]]></name>
      <type><![CDATA[smartCollectionContent($col$)]]></type>
      <value><![CDATA[Object]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[var]]></name>
      <type><![CDATA[suggestNameFromType($type$)]]></type>
      <value><![CDATA[var]]></value>
      <editable>true</editable>
    </variable>
  </item>
   <item>
    <abbr><![CDATA[itmv]]></abbr>
    <descr><![CDATA[Iterate over map values]]></descr>
    <text><![CDATA[Iterator $iter$ = $map$.values().iterator();
while	($iter$.hasNext())
{
	$type$ $var$ = ($type$) $iter$.next();
	$end$
}]]></text>
    <import>java.util.Iterator</import>
    <variable>
      <name><![CDATA[iter]]></name>
      <type><![CDATA[suggestNameFromType(Iterator)]]></type>
      <value><![CDATA[iter]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[map]]></name>
      <type><![CDATA[varOfType(java.util.Map)]]></type>
      <value><![CDATA[map]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[type]]></name>
      <type><![CDATA[smartMapValues($map$)]]></type>
      <value><![CDATA[Object]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[var]]></name>
      <type><![CDATA[suggestNameFromType($type$)]]></type>
      <value><![CDATA[var]]></value>
      <editable>true</editable>
    </variable>
  </item>
   <item>
    <abbr><![CDATA[itar]]></abbr>
    <descr><![CDATA[Iterate over array]]></descr>
    <text><![CDATA[for	(int $i$ = 0; $i$ < $array$.length; $i$++)
{
	$type$ $var$ = $array$[$i$]; 
	$end$
}]]></text>
    <variable>
      <name><![CDATA[array]]></name>
      <type><![CDATA[arrays]]></type>
      <value><![CDATA[array]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[i]]></name>
      <type><![CDATA[smartIndex]]></type>
      <value><![CDATA[xxxxxxxxxxxxxxx]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[type]]></name>
      <type><![CDATA[elementTypeOf($array$)]]></type>
      <value><![CDATA[Object]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[var]]></name>
      <type><![CDATA[suggestNameFromType($type$)]]></type>
      <value><![CDATA[var]]></value>
      <editable>true</editable>
    </variable>
  </item>
   <item>
    <abbr><![CDATA[iofc]]></abbr>
    <descr><![CDATA[instanceof + cast]]></descr>
    <text><![CDATA[if	($var$ instanceof $type$)
{
	$type$ $casted$ = ($type$) $var$;
	$end$
}]]></text>
    <variable>
      <name><![CDATA[casted]]></name>
      <type><![CDATA[suggestNameFromType($type$)]]></type>
      <value><![CDATA[casted]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[type]]></name>
      <type><![CDATA[default]]></type>
      <value><![CDATA[Object]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[var]]></name>
      <type><![CDATA[varOfType(java.lang.Object)]]></type>
      <value><![CDATA[var]]></value>
      <editable>true</editable>
    </variable>
  </item>
   <item>
    <abbr><![CDATA[itli]]></abbr>
    <descr><![CDATA[Iterate over a list]]></descr>
    <text><![CDATA[for	(int $i$ = 0; $i$ < $list$.size(); $i$++)
{
	$type$ $var$ = ($type$) $list$.get($i$);
	$end$
}]]></text>
    <variable>
      <name><![CDATA[i]]></name>
      <type><![CDATA[smartIndex]]></type>
      <value><![CDATA[xxxxxxxxxxx]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[list]]></name>
      <type><![CDATA[varOfType(java.util.List)]]></type>
      <value><![CDATA[list]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[type]]></name>
      <type><![CDATA[smartListContent($list$)]]></type>
      <value><![CDATA[Object]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[var]]></name>
      <type><![CDATA[suggestNameFromType($type$)]]></type>
      <value><![CDATA[var]]></value>
      <editable>true</editable>
    </variable>
  </item>
   <item>
    <abbr><![CDATA[ife]]></abbr>
    <descr><![CDATA[if else statement]]></descr>
    <text><![CDATA[if ($end$) 
{
	
} else 
{
	
}
]]></text>
  </item>
   <item>
    <abbr><![CDATA[for]]></abbr>
    <descr><![CDATA[for loop]]></descr>
    <text><![CDATA[for ($end$ ; ; ) 
{
	
}
]]></text>
  </item>
   <item>
    <abbr><![CDATA[try]]></abbr>
    <descr><![CDATA[try statement]]></descr>
    <text><![CDATA[try 
{
	$end$
} catch (Exception ex) 
{
	ex.printStackTrace();
} finally 
{
}
]]></text>
  </item>
   <item>
    <abbr><![CDATA[pri]]></abbr>
    <descr><![CDATA[private int]]></descr>
    <text><![CDATA[private int _$end$;]]></text>
  </item>
   <item>
    <abbr><![CDATA[prb]]></abbr>
    <descr><![CDATA[private boolean]]></descr>
    <text><![CDATA[private boolean _$end$;]]></text>
  </item>
   <item>
    <abbr><![CDATA[prs]]></abbr>
    <descr><![CDATA[private String]]></descr>
    <text><![CDATA[private String _$end$;]]></text>
  </item>
   <item>
    <abbr><![CDATA[sop]]></abbr>
    <descr><![CDATA[System.out.println]]></descr>
    <text><![CDATA[System.out.println($end$);]]></text>
  </item>
   <item>
    <abbr><![CDATA[sep]]></abbr>
    <descr><![CDATA[System.err.println]]></descr>
    <text><![CDATA[System.err.println($end$);]]></text>
  </item>
   <item>
    <abbr><![CDATA[if]]></abbr>
    <descr><![CDATA[if statement]]></descr>
    <text><![CDATA[if ($end$) 
{
		
}
]]></text>
  </item>
   <item>
    <abbr><![CDATA[sw]]></abbr>
    <descr><![CDATA[switch statement]]></descr>
    <text><![CDATA[switch ($end$) 
{
	case XXX:
		{
			
		}
		break;

	default:
		{
			
		}
		break;
}
]]></text>
  </item>
   <item>
    <abbr><![CDATA[wh]]></abbr>
    <descr><![CDATA[while statement]]></descr>
    <text><![CDATA[while ($end$) 
{
	
}
]]></text>
  </item>
   <item>
    <abbr><![CDATA[ai]]></abbr>
    <descr><![CDATA[Array Iterator]]></descr>
    <text><![CDATA[for (int $i$ = 0; $i$ < $array$.length; $i$++)
{
	$type$ $var$ = $array$[$i$];
	$end$
}]]></text>
    <variable>
      <name><![CDATA[array]]></name>
      <type><![CDATA[arrays]]></type>
      <value><![CDATA[unknown]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[i]]></name>
      <type><![CDATA[smartIndex]]></type>
      <value><![CDATA[xxxxx]]></value>
      <editable>true</editable>
    </variable>
    <variable>
      <name><![CDATA[type]]></name>
      <type><![CDATA[elementTypeOf($array$)]]></type>
      <value><![CDATA[Object]]></value>
      <editable>false</editable>
    </variable>
    <variable>
      <name><![CDATA[var]]></name>
      <type><![CDATA[suggestNameFromType($type$)]]></type>
      <value><![CDATA[var]]></value>
      <editable>true</editable>
    </variable>
  </item>
   <item>
    <abbr><![CDATA[conn]]></abbr>
    <descr><![CDATA[JDBC Connection]]></descr>
    <text><![CDATA[public static Connection getConnection() throws SQLException
{
	String username = "$end$scott";
	String password = "tiger";
	String thinConn = "jdbc:oracle:thin:@localhost:1521:ORCL";
	DriverManager.registerDriver(new OracleDriver());
	Connection conn = DriverManager.getConnection(thinConn,username,password);
	conn.setAutoCommit(false);
	return conn;
}
]]></text>
    <import>java.sql.*</import>
    <import>oracle.jdbc.OracleDriver</import>
  </item>
   <item>
    <abbr><![CDATA[tag]]></abbr>
    <descr><![CDATA[Hml / jsp tag]]></descr>
    <text><![CDATA[<$tag$>
	$end$
</$tag$>
]]></text>
    <variable>
      <name><![CDATA[tag]]></name>
      <type><![CDATA[default]]></type>
      <value><![CDATA[tag]]></value>
      <editable>true</editable>
    </variable>
  </item>
   <item>
    <abbr><![CDATA[bc4jclient]]></abbr>
    <descr><![CDATA[Instantiate a BC4J application module]]></descr>
    <text><![CDATA[String        amDef = "test.TestModule";
String        config = "TestModuleLocal";
ApplicationModule am =
Configuration.createRootApplicationModule(amDef,config);
ViewObject vo = am.findViewObject("TestView");
$end$// Work with your appmodule and view object here
Configuration.releaseRootApplicationModule(am,true);]]></text>
    <import>oracle.jbo.client.Configuration</import>
    <import>oracle.jbo.*</import>
    <import>oracle.jbo.domain.Number</import>
    <import>oracle.jbo.domain.*</import>
  </item>
  <item>
    <abbr><![CDATA[daev]]></abbr>
    <descr><![CDATA[Data Action Event Handler]]></descr>
    <text><![CDATA[public void on$end$(PageLifecycleContext ctx)
{
}]]></text>
    <import>oracle.adf.controller.v2.context.PageLifecycleContext</import>
  </item>  
</template>