import json

def generate_sql_file():
    try:
        # Carregar os dados do JSON
        with open('data.json', 'r') as f:
            data = json.load(f)

        # Abrir um ficheiro .sql para escrita
        with open('02-load_data.sql', 'w') as sql_file:
            # Inserir dados na tabela securities
            for security in data:
                sql_file.write(
                    f"INSERT INTO securities (symbol, security_name, sector, country, trend) VALUES ('{security['ticker']}', '{security['securityName']}', '{security['sector']}', '{security['country']}', '{security['trend']}');\n"
                )

                # Gerar os inserts para a tabela time_series
                for price in security['prices']:
                    sql_file.write(
                        f"INSERT INTO time_series (security_id, date, close_price, volume) VALUES ((SELECT id FROM securities WHERE symbol = '{security['ticker']}'), '{price['date']}', {float(price['close'])}, {int(price['volume'])});\n"
                    )

        print("Ficheiro SQL gerado com sucesso: load_data.sql")
    except Exception as e:
        print(f"Erro ao gerar ficheiro SQL: {e}")

if __name__ == '__main__':
    generate_sql_file()