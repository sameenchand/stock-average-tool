from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/profit-loss')
def profit_loss():
    return render_template('profit_loss.html')

@app.route('/dca')
def dca():
    return render_template('dca.html')

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
