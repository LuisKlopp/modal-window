from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

import requests
from bs4 import BeautifulSoup

from pymongo import MongoClient
import certifi

ca = certifi.where()
client = MongoClient('mongodb+srv://test:sparta@cluster0.xaxuh.mongodb.net/Cluster0?retryWrites=true&w=majority')
client = MongoClient('mongodb+srv://test:sparta@Cluster0.j0ygw.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.dbsparta

@app.route('/')
def home():


    return render_template('index.html')


@app.route("/travel", methods=["POST"])
def movie_post():
    url_receive = request.form['url_give']
    comment_receive = request.form['comment_give']

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    # title = soup.select_one('meta[name="twitter:title"]')['content']
    # image = soup.select_one('meta[name="twitter:image"]')['content']
    # desc = soup.select_one('meta[name="twitter:description"]')['content']
    image = soup.select_one('meta[property="og:image"]')['content']
    title = soup.select_one('meta[property="og:title"]')['content']
    desc = soup.select_one('meta[property="og:description"]')['content']
    plus = {
        'what' : 'hihihi',
        'the' : 'thth',
        'hell' : 'hihiss'
    }

    doc = {
        'title' :title,
        'image' :image,
        'desc' :desc,
        'comment' :comment_receive,
        'plus' : plus
    }
    db.travels.insert_one(doc)


    return jsonify({'msg': '저장완료'})


@app.route("/travel", methods=["GET"])
def movie_get():

    travel_list = list(db.travels.find({},{'_id':False}))


    return jsonify({'travels': travel_list})


# ---------------모달 ---------------------------
@app.route("/supplies", methods=["POST"])
def supplies_post():
    supplies_receive = request.form['supplies_give']
    supplies_list = list(db.supplies.find({}, {'_id': False}))
    count = len(supplies_list) + 1

    doc = {
        'num': count,
        'supplies': supplies_receive,
        'done': 0,
        'comment': ''
    }

    db.supplies.insert_one(doc)

    return jsonify({'msg': '등록 완료!', 'supplies':supplies_list, 'count':count })
 


@app.route("/supplies/done", methods=["POST"])
def supplies_done():
    num_receive = request.form['num_give']
    supplies_num = db.supplies.find_one({'num': int(num_receive)})
    print(supplies_num['done'])
    if supplies_num['done'] == 0:
        db.supplies.update_one({'num': int(num_receive)}, {'$set': {'done': 1}})
    else:
        db.supplies.update_one({'num': int(num_receive)}, {'$set': {'done': 0}})
    return jsonify({'msg': '체크 완료!', 'done':supplies_num['done']})



@app.route("/supplies/delete", methods=["POST"])
def supplies_delete():
    num_receive = request.form['num_give']
    db.supplies.delete_one({'num': int(num_receive)})
    return jsonify({'msg': '삭제 완료!'})



@app.route("/supplies/all_delete", methods=["POST"])
def delete_all():
    db.supplies.delete_many({})
    return jsonify({'msg': '전체 삭제 완료!'})




@app.route("/supplies", methods=["GET"])
def supplies_get():
    supplies_list = list(db.supplies.find({}, {'_id': False}))
    return jsonify({'supplies': supplies_list})


# @app.route("/supplies/comment", methods=["GET"])
# def supplies_get():
#     supplies_list = list(db.supplies.find({}, {'_id': False}))
#     return jsonify({'supplies': supplies_list})

@app.route("/supplies/comment", methods=["POST"])
def comment_post():
    comment_receive = request.form['comment_give']
    num_receive = request.form['num_give']
    supplies_num = db.supplies.find_one({'num': int(num_receive)})
    print(supplies_num)
    db.supplies.update_one({'num': int(num_receive)}, {'$set': {'comment': comment_receive}})
    supplies_list = list(db.supplies.find({}, {'_id': False}))
    return jsonify({'msg': '등록 완료!', 'supplies': supplies_list})



# ---------------모달 ---------------------------

if __name__ == '__main__':
    app.run('0.0.0.0', port=3000, debug=True)