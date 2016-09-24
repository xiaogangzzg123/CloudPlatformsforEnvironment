using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace WikiTester.DbOperation
{
    /// <summary>
    /// 数据访问层
    /// </summary>
    public class DbHelper
    {
        #region 属性

        /// <summary>
        /// 链接字符串
        /// </summary>
        private string conStr = string.Empty;

        #endregion

        #region 外部函数

        /// <summary>
        /// 构造函数，初始化连接字符串
        /// </summary>
        /// <param name="conStr">链接字符串</param>
        public DbHelper(string conStr)
        {
            this.conStr = conStr;
        }

        /// <summary>
        /// 打开数据库链接
        /// </summary>
        public SqlConnection OpenDb()
        {
            SqlConnection con = new SqlConnection(conStr);
            if(con != null)
                con.Open();

            return con;
        }

        /// <summary>
        /// 关闭数据库链接
        /// </summary>
        /// <param name="con">要关闭的链接</param>
        public void CloseDb(SqlConnection con)
        {
            if (con == null)
                return;
            if (con.State == ConnectionState.Open)
                con.Close();
        }

        /// <summary>
        /// 执行 查询 sql 语句并 返回结果集
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public DataSet ExecuteQuery(string sql)
        {
            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(conStr))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand())
                {                    
                    cmd.Connection = con;
                    cmd.CommandText = sql;
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(ds);
                }
            }
            return ds;
        }

        /// <summary>
        /// 执行 插入、修改、删除
        /// </summary>
        /// <param name="sql">sql 语句</param>
        /// <returns>返回 受影响的行数</returns>
        public int Execute(string sql)
        {
            int row = 0;
            using (SqlConnection con = new SqlConnection(conStr))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand(sql))
                {
                    cmd.Connection = con;
                    using (SqlTransaction trans = con.BeginTransaction())
                    {
                        cmd.Transaction = trans;

                        try
                        {                            
                            row = cmd.ExecuteNonQuery();
                            trans.Commit();
                        }
                        catch (Exception ex)
                        {
                            //如果是 完善的做法，这里的异常应该写入数据库。
                            trans.Rollback();
                        }
                    }
                }
            }
            return row;
        }

        /// <summary>
        /// 执行 插入、修改、删除
        /// </summary>
        /// <param name="cmd">要执行的 SqlCommand</param>
        /// <returns>返回 受影响的行数</returns>
        public int Execute(SqlCommand cmd)
        {
            int rowNum = 0;
            using (SqlConnection con = new SqlConnection(conStr))
            {
                con.Open();
                cmd.Connection = con;

                using (SqlTransaction trans = con.BeginTransaction())
                {
                    cmd.Transaction = trans;

                    try
                    {                                               
                        rowNum = cmd.ExecuteNonQuery();
                        trans.Commit();
                    }
                    catch (Exception ex)
                    {
                        //如果是 完善的做法，这里的异常应该写入数据库。
                        trans.Rollback();
                    }
                }
            }
            return rowNum;
        }

        /// <summary>
        /// 执行指定名称的存储过程
        /// </summary>
        /// <param name="sql">存储过程名称</param>
        /// <returns>表集</returns>
        public DataSet ExecuteProc(string name)
        {
            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(conStr))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand())
                {                    
                    cmd.Connection = con;                    
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = name;
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);

                    using (SqlTransaction trans = con.BeginTransaction())
                    {                        
                        try
                        {                           
                            adapter.Fill(ds);
                            trans.Commit();
                        }
                        catch(Exception ex)
                        {
                            trans.Rollback();
                        }
                    }
                }
            }
            return ds;
        }

        /// <summary>
        /// 重载，执行存储过程
        /// </summary>
        /// <param name="cmd">设置好的 SqlCommand</param>
        /// <returns>表集</returns>
        public DataSet ExecuteProc(SqlCommand cmd)
        {
            DataSet ds = new DataSet();
            using (SqlConnection con = new SqlConnection(conStr))
            {
                con.Open();
                cmd.Connection = con;
                SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                using (SqlTransaction trans = con.BeginTransaction())
                {
                    cmd.Transaction = trans;

                    try
                    {
                        adapter.Fill(ds);
                        trans.Commit();
                    }
                    catch(Exception ex)
                    {
                        trans.Rollback();
                    }
                }
            }
            return ds;
        }

        /// <summary>
        /// 重载，执行存储过程
        /// </summary>
        /// <param name="name">存储过程名称</param>
        /// <param name="parameters">存储过程参数</param>
        /// <returns>表集</returns>
        public DataSet ExecuteProc(string name,SqlParameter[] parameters)
        {
            DataSet ds = new DataSet();
            using(SqlConnection con = new SqlConnection(conStr))
            {
                con.Open();
                using(SqlCommand cmd = new SqlCommand())
                {
                    cmd.Connection = con;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = name;
                    cmd.Parameters.AddRange(parameters);

                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);

                    using(SqlTransaction trans = con.BeginTransaction())
                    {
                        cmd.Transaction = trans;

                        try
                        {
                            adapter.Fill(ds);
                            trans.Commit();
                        }
                        catch (Exception ex)
                        {
                        	trans.Rollback();
                        }
                    }
                }
            }

            return ds;
        }

        /// <summary>
        /// 查询，获取第一行数据
        /// </summary>
        /// <param name="sql">sql 语句</param>
        /// <returns>返回行</returns>
        public DataRow ExecuteRow(string sql)
        {
            DataSet ds = new DataSet();
            using(SqlConnection con = new SqlConnection(conStr))
            {
                con.Open();
                using(SqlCommand cmd = new SqlCommand(sql))
                {
                    cmd.Connection = con;
                    cmd.CommandType = CommandType.Text;                    
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    adapter.Fill(ds);
                }
            }

            if (ds != null)
            {
                DataTable dt = ds.Tables[0];
                if (ds.Tables[0] != null && ds.Tables[0].Rows.Count > 0)
                    return ds.Tables[0].Rows[0];
            }

            return null;
        }

        /// <summary>
        /// 获取第一行第一列的数据
        /// </summary>
        /// <param name="typeStr">sql语句或者存储过程名称</param>
        /// <param name="type">类型</param>
        /// <returns>第一行第一列数据</returns>
        public object GetFirstObject(string typeStr,CommandType type)
        {
            object obj = null;
            using(SqlConnection con = new SqlConnection(conStr))
            {
                con.Open();
                using(SqlCommand cmd = new SqlCommand(typeStr))
                {
                    cmd.Connection = con;
                    cmd.CommandType = type;
                    using(SqlTransaction trans = con.BeginTransaction())
                    {
                        cmd.Transaction = trans;

                        try
                        {
                            obj = cmd.ExecuteScalar();
                            trans.Commit();
                        }
                        catch(Exception ex)
                        {
                            trans.Rollback();
                        }
                    }
                }
            }

            return obj;
        }
       
        /// <summary>
        /// 获得 SqlDataReader,在使用完需要调用 CloseDb 关闭数据库链接
        /// </summary>
        /// <param name="name">sql 语句或存储过程名称</param>
        /// <param name="type">类型</param>
        /// <returns>SqlDataReader</returns>
        public SqlDataReader GetReader(string typeStr, CommandType type)
        {
            SqlConnection con = new SqlConnection(conStr);        
            con.Open();
            using (SqlCommand cmd = new SqlCommand(typeStr))
            {
                cmd.Connection = con;
                cmd.CommandType = type;              
                SqlDataReader reader = cmd.ExecuteReader();
                return reader;
            }            
        }

        /// <summary>
        /// 重载，获得 SqlDataReader,在使用完需要调用 CloseDb 关闭数据库链接
        /// </summary>
        /// <param name="typeStr">sql 语句或存储过程名称</param>
        /// <param name="type">类型</param>
        /// <param name="parameters">存储过程参数</param>
        /// <returns>SqlDataReader</returns>
        public SqlDataReader GetReader(string typeStr, CommandType type,SqlParameter[] parameters)
        {
            SqlConnection con = new SqlConnection(conStr);
            con.Open();
            using (SqlCommand cmd = new SqlCommand(typeStr))
            {
                cmd.Connection = con;
                cmd.CommandType = type;
                cmd.Parameters.AddRange(parameters);
                SqlDataReader reader = cmd.ExecuteReader();
                return reader;
            }
        }

        #endregion
    }
}