var app = new Vue({
    el: '#app',
    data: {
        timer: null,
        seconds: 0,
        playing: false,
        cardNumber: 8,
        fieldCard: [0,0,0,0,0,0,0,0,0],
        myCard: [0,0,0,0,0,0,0,0,0],
        markId: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
    },
    methods: {
        // ゲームを開始する
        startGame() {
            // 場札と手札を設定する
            var randomArray = this.getRandomArray([].concat(this.markId));
            this.fieldCard = this.getRandomArray(randomArray.slice(0, 9));
            this.myCard = this.getRandomArray(randomArray.slice(8, 17));

            // timerを設定する
            if (this.timer != null) {
                this.seconds = 0;
                clearInterval(this.timer);
            }
            this.timer = setInterval(() => { this.seconds++ }, 1000);

            // ゲームを開始する
            this.playing = true;
            this.cardNumber = 8;
        },
        // マークを選択する
        selectMark(markIndex) {
            // 開始していない場合は何もしない
            if (this.playing != true) {
                return;
            }

            var markNumber = this.myCard[markIndex-1];

            // 誤答
            if (!this.judgeAnswer(markNumber)) {
                alert("間違い。ペナルティとして15秒加算されます");
                this.seconds += 15;
                return;
            }

            // 正答
            this.cardNumber -= 1;

            if (this.cardNumber > 0) {
                this.fieldCard = this.myCard;
                var remainArray = this.excludeArray([].concat(this.markId), this.fieldCard);
                var randomArray = this.getRandomArray(remainArray.slice(0, 8));
                randomArray.push(this.getRandomElement(this.fieldCard));
                this.myCard = this.getRandomArray(randomArray);
                return;
            }

            this.playing = false;
            this.fieldCard = [0,0,0,0,0,0,0,0,0];
            this.myCard = [0,0,0,0,0,0,0,0,0];
            alert("ゲームクリア。クリアタイムは「" + this.seconds + "秒」です");
            clearInterval(this.timer);
        },
        // 正否を判定する
        judgeAnswer(markNumber) {
            for (var i in this.fieldCard) {
                if (markNumber == this.fieldCard[i]) {
                    return true;
                }
            }
            return false;
        },
        excludeArray(sourceArray, targetArray) {
            for (var i=0; i<targetArray.length; i++) {
                for (var j=0; j<sourceArray.length; j++) {
                    if (sourceArray[j] == targetArray[i]) {
                        sourceArray.splice(j, 1);
                        break;
                    }
                }
            }
            return sourceArray;
        },
        getRandomArray(array) {
            for (var i=array.length-1; i>=0; i--) {
                var rand = Math.floor(Math.random() * (i + 1));
                [array[i], array[rand]] = [array[rand], array[i]];
            }
            return array;
        },
        getRandomElement(array) {
            var rand = Math.floor(Math.random() * (array.length));
            return array[rand];
        },
        zeroPad(number) {
            let str = number.toString();
            if (str.length == 1) {
                str = '0' + str;
            }
            return str;
        },
        getFieldCardMark(markIndex) {
            return "src/img/" + this.fieldCard[markIndex-1] + ".png";
        },
        getMyCardMark(markIndex) {
            return "src/img/" + this.myCard[markIndex-1] + ".png";
        }
    },
    computed: {
        countUpTimer() {
            const hours = Math.floor(this.seconds / 3600);
            const minutes = Math.floor(this.seconds % 3600 / 60);
            const seconds = Math.floor(this.seconds % 3600 % 60);
            return this.zeroPad(hours) + ':' + this.zeroPad(minutes) + ':' + this.zeroPad(seconds);
        }
    }
});