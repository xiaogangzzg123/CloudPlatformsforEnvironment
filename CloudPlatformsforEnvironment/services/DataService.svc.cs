using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using WikiTester.DbOperation;
using System.Data.SqlClient;
using System.Web.Services;
using System.Web.Script.Services;

namespace CloudPlatformsforEnvironment
{
    [ServiceContract(Namespace = "")]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

    public class DataService
    {
        string conStr = "Integrated Security=SSPI;Persist Security Info=False;Initial Catalog=CloudPlatformsforEnvironment;Data Source=INTMINOR-PC\\SQLEXPRESS";

        [WebInvoke]
        public string GetEnterpriseDescartesData()
        {
            int[] timeData = new int[5] { int.Parse(DateTime.Now.AddDays(-1).ToString("dd")), int.Parse(DateTime.Now.AddDays(-2).ToString("dd")), int.Parse(DateTime.Now.AddDays(-3).ToString("dd")), int.Parse(DateTime.Now.AddDays(-4).ToString("dd")), int.Parse(DateTime.Now.AddDays(-5).ToString("dd")) };

            double[,] pollutionValue = new double[5, 6];

            string[] pollutionProp = new string[6];

            DbHelper dbHelper = new DbHelper(conStr);

            dbHelper.OpenDb();

            int[] index = new int[6];
            index = RandomIndex(1, 24, index);

            string sql = "SELECT ";

            for (int i = 0; i < index.Length; i++)
            {
                if (index[i] < 10) sql += "[Polluted_0" + index[i] + "]";
                else sql += "[Polluted_" + index[i] + "]";

                if (i < index.Length - 1) sql += ",";
            }

            for (int i = 10; i > 5; i--)
            {
                string sqlCurrent = sql;

                if (i == 10) sqlCurrent += " FROM POLLUTIONENTERPRISE_2016_09_10";
                else sqlCurrent += " FROM POLLUTIONENTERPRISE_2016_09_0" + i;

                sqlCurrent += " WHERE Id = " + int.Parse("100");

                DataSet dataSet = dbHelper.ExecuteQuery(sqlCurrent);

                DataTable dataTable = dataSet.Tables[0];

                foreach (DataRow dataRow in dataTable.Rows)
                {
                    for (int j = 0; j < index.Length; j++)
                    {
                        string dataRowIndex;

                        if (index[j] < 10) dataRowIndex = "Polluted_0" + index[j];
                        else dataRowIndex = "Polluted_" + index[j];

                        pollutionValue[10 - i, j] = Double.Parse(Convert.ToDouble(dataRow[dataRowIndex]).ToString("0.000"));
                    }
                }

                //dbHelper.CloseDb(new SqlConnection(conStr));
            }

            for (int i = 0; i < index.Length; i++)
            {
                sql = string.Empty;

                if (index[i] < 10)
                {
                    sql = "SELECT [Name]"
                        + " FROM Pollutant"
                        + " WHERE Pollutant = " + "'Polluted_0" + index[i] + "'";
                }
                else
                {
                    sql = "SELECT [Name]"
                        + " FROM Pollutant"
                        + " WHERE Pollutant = " + "'Polluted_" + index[i] + "'";
                }

                DataSet dataSet = dbHelper.ExecuteQuery(sql);

                DataTable dataTable = dataSet.Tables[0];

                foreach (DataRow dataRow in dataTable.Rows)
                {
                    pollutionProp[i] = Convert.ToString(dataRow["Name"]);
                }
            }

            dbHelper.CloseDb(new SqlConnection(conStr));

            //string data = "{" + "\"content\": [\"EnterpriseDescartes\"],"
            //                 + "\"timeData\": [\"" + timeData[4] + " 日\", \"" + timeData[3] + " 日\", \"" + timeData[2] + " 日\", \"" + timeData[1] + " 日\", \"" + timeData[0] + " 日\"],"
            //                 + "\"pollutionProp\": [\"" + pollutionProp[0] + "\", \"" + pollutionProp[1] + "\",\"" + pollutionProp[2] + "\", \"" + pollutionProp[3] + "\", \"" + pollutionProp[4] + "\", \"" + pollutionProp[5] + "\"],"
            //                 + "\"pollutionValue\": [[" + pollutionValue[0, 0] + ", " + pollutionValue[0, 1] + ", " + pollutionValue[0, 2] + ", " + pollutionValue[0, 3] + ", " + pollutionValue[0, 4] + ", " + pollutionValue[0, 5] + "], ["
            //                 + pollutionValue[1, 0] + ", " + pollutionValue[1, 1] + ", " + pollutionValue[1, 2] + ", " + pollutionValue[1, 3] + ", " + pollutionValue[1, 4] + ", " + pollutionValue[1, 5] + "],["
            //                 + pollutionValue[2, 0] + ", " + pollutionValue[2, 1] + ", " + pollutionValue[2, 2] + ", " + pollutionValue[2, 3] + ", " + pollutionValue[2, 4] + ", " + pollutionValue[2, 5] + "],["
            //                 + pollutionValue[3, 0] + ", " + pollutionValue[3, 1] + ", " + pollutionValue[3, 2] + ", " + pollutionValue[3, 3] + ", " + pollutionValue[3, 4] + ", " + pollutionValue[3, 5] + "],["
            //                 + pollutionValue[4, 0] + ", " + pollutionValue[4, 1] + ", " + pollutionValue[4, 2] + ", " + pollutionValue[4, 3] + ", " + pollutionValue[4, 4] + ", " + pollutionValue[4, 5] + "]]"
            //                 + "}";

            string data = "{" + "\"content\": [\"EnterpriseDescartes\"],";

            data += "\"timeData\": [\"";

            for (int i = 0; i < timeData.Length; i++)
            {
                if (i == timeData.Length - 1) data += timeData[i] + " 日\"],";
                else data += timeData[i] + " 日\", \"";
            }

            data += "\"pollutionProp\": [\"";

            for (int i = 0; i < pollutionProp.Length; i++)
            {
                if (i == pollutionProp.Length - 1) data += pollutionProp[i] + "\"],";
                else data += pollutionProp[i] + "\", \"";
            }

            data += "\"pollutionValue\": [";

            for (int i = 0; i < pollutionValue.GetLength(0); i++)
            {
                data += "[";

                for (int j = 0; j < pollutionValue.GetLength(1); j++)
                {
                    data += pollutionValue[i, j];

                    if (j == pollutionValue.GetLength(1) - 1) data += "]";
                    else data += ", ";
                }

                if (i != pollutionValue.GetLength(0) - 1) data += ", ";
                else data += "]";
            }

            data += "}";

            return data;
        }

        [WebInvoke]
        public string GetProvinceDescartesData()
        {
            string[] pollutionProp = new string[24];

            double[] pollutionValue = new double[24];

            DbHelper dbHelper = new DbHelper(conStr);

            dbHelper.OpenDb();

            string sql = "SELECT [Name] FROM Pollutant";

            DataSet dataSet = dbHelper.ExecuteQuery(sql);

            DataTable dataTable = dataSet.Tables[0];

            int index = 0;

            foreach (DataRow dataRow in dataTable.Rows)
            {
                pollutionProp[index] = dataRow["Name"].ToString();
                index++;
            }

            for (int i = 1; i < 25; i++)
            {
                sql = "SELECT ";
                string field;

                if (i < 10) field = "Polluted_0" + i;
                else field = "Polluted_" + i;

                sql += "SUM(" + field + ") as 'PollutedTotal' FROM POLLUTIONENTERPRISE_2016_09_10";

                dataSet = dbHelper.ExecuteQuery(sql);

                dataTable = dataSet.Tables[0];

                foreach (DataRow dataRow in dataTable.Rows)
                {
                    pollutionValue[i - 1] = Double.Parse(Convert.ToDouble(dataRow["PollutedTotal"]).ToString("0.000"));
                }
            }

            dbHelper.CloseDb(new SqlConnection(conStr));

            //string data = "{" + "\"content\": [\"ProvinceDescartes\"],"
            //             + "\"pollutionProp\": [\"" + pollutionProp[0] + "\", \"" + pollutionProp[1] + "\",\"" + pollutionProp[2] + "\", \"" + pollutionProp[3] + "\", \"" + pollutionProp[4] + "\", \"" + pollutionProp[5] + "\",\""
            //             + pollutionProp[6] + "\", \"" + pollutionProp[7] + "\",\"" + pollutionProp[8] + "\", \"" + pollutionProp[9] + "\", \"" + pollutionProp[10] + "\", \"" + pollutionProp[11] + "\",\""
            //             + pollutionProp[12] + "\", \"" + pollutionProp[13] + "\",\"" + pollutionProp[14] + "\", \"" + pollutionProp[15] + "\", \"" + pollutionProp[16] + "\", \"" + pollutionProp[17] + "\",\""
            //             + pollutionProp[18] + "\", \"" + pollutionProp[19] + "\",\"" + pollutionProp[20] + "\", \"" + pollutionProp[21] + "\", \"" + pollutionProp[22] + "\", \"" + pollutionProp[23] + "\"],"
            //             + "\"pollutionValue\": [\"" + pollutionValue[0] + "\", \"" + pollutionValue[1] + "\",\"" + pollutionValue[2] + "\", \"" + pollutionValue[3] + "\", \"" + pollutionValue[4] + "\", \"" + pollutionValue[5] + "\",\""
            //             + pollutionValue[6] + "\", \"" + pollutionValue[7] + "\",\"" + pollutionValue[8] + "\", \"" + pollutionValue[9] + "\", \"" + pollutionValue[10] + "\", \"" + pollutionValue[11] + "\",\""
            //             + pollutionValue[12] + "\", \"" + pollutionValue[13] + "\",\"" + pollutionValue[14] + "\", \"" + pollutionValue[15] + "\", \"" + pollutionValue[16] + "\", \"" + pollutionValue[17] + "\",\""
            //             + pollutionValue[18] + "\", \"" + pollutionValue[19] + "\",\"" + pollutionValue[20] + "\", \"" + pollutionValue[21] + "\", \"" + pollutionValue[22] + "\", \"" + pollutionValue[23] + "\"]"
            //             + "}";

            string data = "{" + "\"content\": [\"ProvinceDescartes\"],";

            data += "\"pollutionProp\": [\"";

            for (int i = 0; i < pollutionProp.Length; i++)
            {
                if (i == pollutionProp.Length - 1) data += pollutionProp[i] + "\"],";
                else data += pollutionProp[i] + "\", \"";
            }

            data += "\"pollutionValue\": [\"";

            for (int i = 0; i < pollutionValue.Length; i++)
            {
                if (i == pollutionValue.Length - 1) data += pollutionValue[i] + "\"]";
                else data += pollutionValue[i] + "\", \"";
            }

            data += "}";

            return data;
        }

        [WebInvoke]
        public string GetPollutantDescartesData_01()
        {
            int[] timeData = new int[5] { int.Parse(DateTime.Now.AddDays(-1).ToString("dd")), int.Parse(DateTime.Now.AddDays(-2).ToString("dd")), int.Parse(DateTime.Now.AddDays(-3).ToString("dd")), int.Parse(DateTime.Now.AddDays(-4).ToString("dd")), int.Parse(DateTime.Now.AddDays(-5).ToString("dd")) };

            string[] cityData = new string[13];

            double[,] pollutionValue = new double[65, 3];

            DbHelper dbHelper = new DbHelper(conStr);

            dbHelper.OpenDb();

            string sql = "SELECT distinct Location FROM POLLUTIONENTERPRISE_2016_09_01";

            DataSet dataSet = dbHelper.ExecuteQuery(sql);

            DataTable dataTable = dataSet.Tables[0];

            int index = 0;

            foreach (DataRow dataRow in dataTable.Rows)
            {
                cityData[index] = dataRow["Location"].ToString();
                index++;
            }

            for (int i = 10; i > 5; i--)
            {
                if (i == 10) sql = " FROM POLLUTIONENTERPRISE_2016_09_10";
                else sql = " FROM POLLUTIONENTERPRISE_2016_09_0" + i;

                for (int j = 0; j < 13; j++)
                {
                    string sqlCurrent = string.Empty;
                    string field;

                    int[] indexCurrent = new int[1];
                    indexCurrent = RandomIndex(1, 24, indexCurrent);

                    if (indexCurrent[0] < 10) field = "Polluted_0" + indexCurrent[0];
                    else field = "Polluted_" + indexCurrent[0];

                    sqlCurrent += "SELECT SUM(" + field + ") as 'PollutedTotal'" + sql + " WHERE Location = '" + cityData[j] + "'";

                    dataSet = dbHelper.ExecuteQuery(sqlCurrent);

                    dataTable = dataSet.Tables[0];

                    foreach (DataRow dataRow in dataTable.Rows)
                    {
                        pollutionValue[(10 - i) * 13 + j, 0] = 10 - i;
                        pollutionValue[(10 - i) * 13 + j, 1] = j;
                        pollutionValue[(10 - i) * 13 + j, 2] = Double.Parse(Convert.ToDouble(dataRow["PollutedTotal"]).ToString("0.000"));
                    }
                }
            }

            string data = "{" + "\"content\": [\"PollutantDescartes_01\"],";

            data += "\"timeData\": [\"";

            for (int i = 0; i < timeData.Length; i++)
            {
                if (i == timeData.Length - 1) data += timeData[i] + " 日\"],";
                else data += timeData[i] + " 日\", \"";
            }

            data += "\"cityData\": [\"";

            for (int i = 0; i < cityData.Length; i++)
            {
                if (i == cityData.Length - 1) data += cityData[i] + "\"],";
                else data += cityData[i] + "\", \"";
            }

            data += "\"pollutionValue\": [";

            for (int i = 0; i < pollutionValue.GetLength(0); i++)
            {
                data += "[";

                for (int j = 0; j < pollutionValue.GetLength(1); j++)
                {
                    data += pollutionValue[i, j];

                    if (j == pollutionValue.GetLength(1) - 1) data += "]";
                    else data += ", ";
                }

                if (i != pollutionValue.GetLength(0) - 1) data += ", ";
                else data += "]";
            }

            data += "}";

            return data;
        }

        [WebInvoke]
        public string GetPollutantDescartesData_02()
        {
            int[] timeData = new int[5] { int.Parse(DateTime.Now.AddDays(-1).ToString("dd")), int.Parse(DateTime.Now.AddDays(-2).ToString("dd")), int.Parse(DateTime.Now.AddDays(-3).ToString("dd")), int.Parse(DateTime.Now.AddDays(-4).ToString("dd")), int.Parse(DateTime.Now.AddDays(-5).ToString("dd")) };

            double[,] pollutionValue = new double[5, 8];

            string[] pollutionProp = new string[8];

            DbHelper dbHelper = new DbHelper(conStr);

            dbHelper.OpenDb();

            int[] index = new int[8];
            index = RandomIndex(1, 24, index);

            string sql = "SELECT ";

            string sqlCurrent;

            for (int i = 10; i > 5; i--)
            {
                sqlCurrent = string.Empty;

                if (i == 10) sqlCurrent += " FROM POLLUTIONENTERPRISE_2016_09_10";
                else sqlCurrent += " FROM POLLUTIONENTERPRISE_2016_09_0" + i;

                for (int j = 0; j < index.Length; j++)
                {
                    sql = "SELECT ";

                    if (index[j] < 10) sql += "SUM(Polluted_0" + index[j] + ") AS '" + "Polluted_0" + index[j] + "_Total'";
                    else sql += "SUM([Polluted_" + index[j] + "]) AS '" + "Polluted_" + index[j] + "_Total'";

                    sql += sqlCurrent;

                    sql += " WHERE Location = '" + "南京市' ";

                    DataSet dataSet = dbHelper.ExecuteQuery(sql);

                    DataTable dataTable = dataSet.Tables[0];

                    foreach (DataRow dataRow in dataTable.Rows)
                    {
                        string dataRowIndex;

                        if (index[j] < 10) dataRowIndex = "Polluted_0" + index[j] + "_Total";
                        else dataRowIndex = "Polluted_" + index[j] + "_Total";

                        pollutionValue[10 - i, j] = Double.Parse(Convert.ToDouble(dataRow[dataRowIndex]).ToString("0.000"));
                    }
                }
                //dbHelper.CloseDb(new SqlConnection(conStr));
            }

            for (int i = 0; i < index.Length; i++)
            {
                sql = string.Empty;

                if (index[i] < 10)
                {
                    sql = "SELECT [Name]"
                        + " FROM Pollutant"
                        + " WHERE Pollutant = " + "'Polluted_0" + index[i] + "'";
                }
                else
                {
                    sql = "SELECT [Name]"
                        + " FROM Pollutant"
                        + " WHERE Pollutant = " + "'Polluted_" + index[i] + "'";
                }

                DataSet dataSet = dbHelper.ExecuteQuery(sql);

                DataTable dataTable = dataSet.Tables[0];

                foreach (DataRow dataRow in dataTable.Rows)
                {
                    pollutionProp[i] = Convert.ToString(dataRow["Name"]);
                }
            }

            dbHelper.CloseDb(new SqlConnection(conStr));

            //string data = "{" + "\"content\": [\"PollutantDescartes_02\"],"
            //                 + "\"timeData\": [\"" + timeData[4] + " 日\", \"" + timeData[3] + " 日\", \"" + timeData[2] + " 日\", \"" + timeData[1] + " 日\", \"" + timeData[0] + " 日\"],"
            //                 + "\"pollutionProp\": [\"" + pollutionProp[0] + "\", \"" + pollutionProp[1] + "\",\"" + pollutionProp[2] + "\", \"" + pollutionProp[3] + "\", \"" + pollutionProp[4] + "\", \"" + pollutionProp[5] + "\"],"
            //                 + "\"pollutionValue\": [[" + pollutionValue[0, 0] + ", " + pollutionValue[0, 1] + ", " + pollutionValue[0, 2] + ", " + pollutionValue[0, 3] + ", " + pollutionValue[0, 4] + ", " + pollutionValue[0, 5] + "], ["
            //                 + pollutionValue[1, 0] + ", " + pollutionValue[1, 1] + ", " + pollutionValue[1, 2] + ", " + pollutionValue[1, 3] + ", " + pollutionValue[1, 4] + ", " + pollutionValue[1, 5] + "],["
            //                 + pollutionValue[2, 0] + ", " + pollutionValue[2, 1] + ", " + pollutionValue[2, 2] + ", " + pollutionValue[2, 3] + ", " + pollutionValue[2, 4] + ", " + pollutionValue[2, 5] + "],["
            //                 + pollutionValue[3, 0] + ", " + pollutionValue[3, 1] + ", " + pollutionValue[3, 2] + ", " + pollutionValue[3, 3] + ", " + pollutionValue[3, 4] + ", " + pollutionValue[3, 5] + "],["
            //                 + pollutionValue[4, 0] + ", " + pollutionValue[4, 1] + ", " + pollutionValue[4, 2] + ", " + pollutionValue[4, 3] + ", " + pollutionValue[4, 4] + ", " + pollutionValue[4, 5] + "]]"
            //                 + "}";

            string data = "{" + "\"content\": [\"PollutantDescartes_02\"],";

            data += "\"timeData\": [\"";

            for (int i = 0; i < timeData.Length; i++)
            {
                if (i == timeData.Length - 1) data += timeData[i] + " 日\"],";
                else data += timeData[i] + " 日\", \"";
            }

            data += "\"pollutionProp\": [\"";

            for (int i = 0; i < pollutionProp.Length; i++)
            {
                if (i == pollutionProp.Length - 1) data += pollutionProp[i] + "\"],";
                else data += pollutionProp[i] + "\", \"";
            }

            data += "\"pollutionValue\": [";

            for (int i = 0; i < pollutionValue.GetLength(0); i++)
            {
                data += "[";

                for (int j = 0; j < pollutionValue.GetLength(1); j++)
                {
                    data += pollutionValue[i, j];

                    if (j == pollutionValue.GetLength(1) - 1) data += "]";
                    else data += ", ";
                }

                if (i != pollutionValue.GetLength(0) - 1) data += ", ";
                else data += "]";
            }

            data += "}";

            return data;
        }

        public int[] RandomIndex(int minIndex, int maxIndex, int[] index)
        {
            Random random = new Random();

            int indexCurrent = 0;

            while (indexCurrent < index.Length)
            {
                int indexTemp = random.Next(minIndex, maxIndex);

                if (Array.IndexOf(index, indexTemp) == -1)
                {
                    index[indexCurrent] = indexTemp;
                    indexCurrent++;
                }
            }

            return index;
        }
    }
}
