import json
import psycopg2
from flask import Flask, jsonify

app = Flask(__name__)

def get_db_connection():
    return psycopg2.connect(
        dbname="mydatabase",
        user="leandrofidalgo",
        password="leo1234",
        host="postgres",
        port=5432
    )

@app.route('/securities', methods=['GET'])
def get_securities():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, symbol, security_name, sector, country, trend FROM securities;")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        securities = [
            {
                "id": row[0],
                "symbol": row[1],
                "securityName": row[2],
                "sector": row[3],
                "country": row[4],
                "trend": row[5]
            }
            for row in rows
        ]
        return jsonify(securities)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/securities/<int:security_id>', methods=['GET'])
def get_security_detail(security_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT s.id, s.symbol, s.security_name, s.sector, s.country, s.trend, 
                   ts.date, ts.close_price, ts.volume
            FROM securities s
            LEFT JOIN time_series ts ON s.id = ts.security_id
            WHERE s.id = %s;
        """, (security_id,))
        
        rows = cur.fetchall()
        cur.close()
        conn.close()

        if not rows:
            return jsonify({"error": "Security not found"}), 404

        security = {
            "id": rows[0][0],
            "symbol": rows[0][1],
            "securityName": rows[0][2],
            "sector": rows[0][3],
            "country": rows[0][4],
            "trend": rows[0][5],
            "prices": [
                {"date": row[6], "close_price": row[7], "volume": row[8]}
                for row in rows if row[6] is not None
            ]
        }
        return jsonify(security)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
