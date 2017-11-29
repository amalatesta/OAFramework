package oracle.apps.fnd.framework.toolbox.poplist.server;
import oracle.apps.fnd.framework.server.OAViewObjectImpl;
import oracle.apps.fnd.common.VersionInfo;
//  ---------------------------------------------------------------
//  ---    File generated by Oracle Business Components for Java.
//  ---------------------------------------------------------------
// javadoc_private

public class StatusListVOImpl extends OAViewObjectImpl {

  public static final String RCS_ID="$Header: StatusListVOImpl.java 120.2 2006/07/03 16:17:11 atgops1 noship $";
  public static final boolean RCS_ID_RECORDED =
        VersionInfo.recordClassVersion(RCS_ID, "oracle.apps.fnd.framework.toolbox.poplist.server");

  public void initQuery(String statusCode)
  {
    setWhereClause(null); // Always reset
    setWhereClauseParams(null);
    setWhereClause("LOOKUP_CODE = :1");
    setWhereClauseParam(0, statusCode);
    executeQuery();
  }
  
  /**
   * 
   * This is the default constructor (do not remove)
   */
  public StatusListVOImpl()
  {
  }
}