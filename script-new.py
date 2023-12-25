import pandas as pd
from neo4j import GraphDatabase
from tqdm import tqdm
import questionary
import os


def get_clean_data(data):
    if pd.isna(data) or not data:
        return None
    else:
        try:
            # 处理NaN值，将其替换为None
            return None if pd.isna(data) else data
        except (SyntaxError, ValueError):
            return None


# 定义导入MP数据的函数
def import_data(tx, table, et1, rsp, et2):
    query = (
        "MERGE (entity1:%s {name: $et1})" % (table)
        + "MERGE (entity2:%s {name: $et2})" % (table)
        + "MERGE (entity1)-[relation:%s {type: $rsp}]->(entity2)"
        % (str(rsp).replace(" ", "_"))
    )
    tx.run(query, table=table, et1=et1, rsp=rsp, et2=et2)


def main():
    WORKPATH = os.getcwd()
    IMPORTPATH = os.path.join(WORKPATH, "待导入文件目录")
    if not os.path.exists(IMPORTPATH):
        os.mkdir(IMPORTPATH)

    file_list = os.listdir(IMPORTPATH)

    if file_list == []:
        print("\033[31m待导入文件目录不存在文件,请先添加待导入数据文件重试!\033[0m")
        input("按任意键关闭脚本")
        return

    input("请确保您已开启数据库,按任意键继续导入操作")

    # 连接到Neo4j数据库
    uri = "bolt://localhost:7687"  # 你的Neo4j数据库URI

    username = input("请输入您的数据库用户名: ")  # 您的Neo4j用户名
    password = input("请输入您的数据库密码: ")  # 您的Neo4j密码

    driver = GraphDatabase.driver(uri, auth=(username, password))
    if not driver.verify_authentication(auth=(username, password)):
        print("用户名密码错误,请关闭程序重试")
        return
    while True:
        options = {
            file: [file, file.split("_")[0]]
            for file in file_list
            if file.endswith(".xlsx")
        }

        selects = questionary.checkbox(
            "请选择你要导入的文件(如非规定格式则为当前年份,上下键选择,空格确定):", options
        ).ask()

        for selected in selects:
            # 读取Excel文件
            xlsx_path = f"{WORKPATH}/待导入文件目录/{options[selected][0]}"  # 你的Excel文件路径
            df = pd.read_excel(xlsx_path)  # 读取特定的列

            print(f"按ctrl+c即可中断程序,{selected}导入中...")
            # 使用tqdm显示进度条
            for _, row in tqdm(df.iterrows(), total=df.shape[0]):
                processed_data = [
                    [
                        get_clean_data(row.iloc[i]),
                        get_clean_data(row.iloc[i + 1]),
                        get_clean_data(row.iloc[i + 2]),
                    ]
                    for i in range(0, len(row.iloc[:]) - 2, 2)
                ]
                tableName = options[selected][0].split(".")[0]
                for data in processed_data:
                    # 检查数据是否有效
                    if None in data:
                        continue
                    with driver.session() as session:
                        session.execute_write(import_data, tableName, *data)

            print(f"\033[32m{selected}导入完成\033[0m")
        y_n = questionary.confirm("请问你是否需要继续选择文件导入至数据库(Y:确定,N:关闭程序并取消)").ask()
        if not y_n:
            break

    # 关闭数据库连接
    driver.close()
    print("\033[32m导入完成\033[0m")
    input("按任意键关闭脚本")


main()
