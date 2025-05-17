from flask import Flask, request, jsonify, send_from_directory
import json
import websockets
import asyncio
import logging
import time
import os
import numpy as np
from threading import Thread


logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


app = Flask(__name__, static_folder='../dist')


cached_orderbook = None
last_update = 0


def calculate_slippage(quantity, market_depth, volatility):
    relative_size_impact = quantity / (market_depth + 1)
    return relative_size_impact * volatility * 100  

def calculate_fees(quantity, fee_tier):
    fee_rates = {
        'default': 0.001, 
        'tier1': 0.0008,   
        'tier2': 0.0006,   
        'tier3': 0.0004,   
    }
    
    fee_rate = fee_rates.get(fee_tier, 0.001)
    return quantity * fee_rate

def calculate_market_impact(quantity, volatility, mid_price, depth):
    time_horizon = 1  
    volume = depth
    
    impact = volatility * abs(quantity) * np.sqrt(time_horizon / volume)
    return impact * 100  

def calculate_maker_taker_proportion(quantity, depth):
    proportion = 1 - min(0.9, quantity / (depth * 10 + 1))
    return max(0.1, proportion)  

def process_orderbook(orderbook_data, params):
    start_time = time.time()
    
    
    quantity = params.get('quantity', 100)
    volatility = params.get('volatility', 0.05)
    fee_tier = params.get('feeTier', 'default')
    
   
    bids = [[float(price), float(amount)] for price, amount in orderbook_data['bids']]
    asks = [[float(price), float(amount)] for price, amount in orderbook_data['asks']]
    

    best_ask = asks[0][0] if asks else 0
    best_bid = bids[0][0] if bids else 0
    mid_price = (best_ask + best_bid) / 2
    

    depth_threshold = 0.01  
    upper_bound = mid_price * (1 + depth_threshold)
    lower_bound = mid_price * (1 - depth_threshold)
    
    ask_depth = sum(amount for price, amount in asks if price <= upper_bound)
    bid_depth = sum(amount for price, amount in bids if price >= lower_bound)
    total_depth = ask_depth + bid_depth
    
 
    slippage = calculate_slippage(quantity, total_depth, volatility)
    fees = calculate_fees(quantity, fee_tier)
    market_impact = calculate_market_impact(quantity, volatility, mid_price, total_depth)
    maker_taker_proportion = calculate_maker_taker_proportion(quantity, total_depth)
    
   
    net_cost = slippage + fees + market_impact
    
    end_time = time.time()
    processing_time = (end_time - start_time) * 1000  
    
    return {
        'slippage': slippage,
        'fees': fees,
        'marketImpact': market_impact,
        'netCost': net_cost,
        'makerTakerProportion': maker_taker_proportion,
        'latency': processing_time
    }


async def connect_to_okx():
    global cached_orderbook, last_update
    
    uri = "wss://ws.gomarket-cpp.goquant.io/ws/l2-orderbook/okx/BTC-USDT-SWAP"
    
    while True:
        try:
            logger.info(f"Connecting to WebSocket: {uri}")
            async with websockets.connect(uri) as websocket:
                logger.info("Connected to OKX WebSocket")
                
                while True:
                    message = await websocket.recv()
                    data = json.loads(message)
                    
                    
                    cached_orderbook = data
                    last_update = time.time()
                    
                   
                    if int(last_update) % 10 == 0:
                        logger.info(f"Received orderbook update: {data['symbol']} with {len(data['asks'])} asks and {len(data['bids'])} bids")
                    
        except Exception as e:
            logger.error(f"WebSocket error: {e}")
          
            await asyncio.sleep(5)


def start_websocket_client():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(connect_to_okx())


websocket_thread = Thread(target=start_websocket_client, daemon=True)
websocket_thread.start()


@app.route('/api/orderbook', methods=['GET'])
def get_orderbook():
    
    if cached_orderbook is None:
        return jsonify({'error': 'No orderbook data available'}), 404
    
    return jsonify(cached_orderbook)

@app.route('/api/simulate', methods=['POST'])
def simulate_trade():
   
    if cached_orderbook is None:
        return jsonify({'error': 'No orderbook data available'}), 404
    
    params = request.json
    
    try:
       
        results = process_orderbook(cached_orderbook, params)
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error processing simulation: {e}")
        return jsonify({'error': f'Simulation error: {str(e)}'}), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    
    status = {
        'status': 'online',
        'lastUpdate': last_update,
        'timeSinceUpdate': time.time() - last_update if last_update > 0 else None,
        'hasOrderbook': cached_orderbook is not None
    }
    return jsonify(status)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
  
    logger.info("Starting GoQuant Trade Simulator Backend")
    app.run(debug=True, host='0.0.0.0', port=5000)