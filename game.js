(function(data, lineMath){
  'use strict';

  data = data['testgame'];
  
  var wordfinder = {
    
    state: 'ready', // ready, resigned, completed
    
    init: function(){
      console.log('init');
      wordfinder.controls.create();
      wordfinder.resultsboard.create();      
      wordfinder.wordlist.create();
      wordfinder.gameboard.create();
      wordfinder.canvas.create();
    },
    
    /**
     * basic page controls
     */
    controls:{
      
      create: function(){
        this.enableResign();
        $('#reset').off().on('click', wordfinder.controls.reset);
        $('#resign').off().on('click', wordfinder.controls.resign);
      },
      
      reset: function(){
        console.log('reset');
        
        function reset(){
          wordfinder.state = 'ready';
          wordfinder.wordlist.reset();
          $("#wordlist-subcontainer").empty();
          $("#gameboard-subcontainer").empty();
          $("#results-container").empty();
          wordfinder.init();        
        }
        
        if(wordfinder.state == 'resigned' ||
           wordfinder.state == 'completed'){
          reset();
          return;
        }
        
        var r = confirm("You want to reset the game? All found words will be erased.");
        if (r === true) {
          reset();
        }
      },
      
      resign: function(){
        console.log('resign');
        var r = confirm("You want to resign the game?");
        if (r === true) {
          wordfinder.state = 'resigned';
          wordfinder.resultsboard.indicateResigned();
          wordfinder.gameboard.lock();
        }        
      },
      
      gameCompleted: function(){
        console.log('game-completed');
      },

      enableResign: function(){
        $('#resign').css('visibility','visible');
      },
      
      disableResign: function(){
        $('#resign').css('visibility','hidden');
      }
    
    },

    /**
     * Results, problems indication board
     */        
    resultsboard: {
 
       create: function(){
        console.log('create results board');
        
        var display = $('<div></div>')
                        .attr('id', 'results');
        $('#results-container')
          .append(display);

        this.clear();
      },
      
      update: function(update){
        $("#results").html(update);
      },
      
      indicateComplete: function(){
        wordfinder.gameboard.lock();
        this.update('You found all the words on this puzzle.');
        wordfinder.state = 'completed';
        wordfinder.controls.disableResign();
        $("#results").addClass('completed');
      },
      
      indicateResigned: function(){
        var words = wordfinder.wordlist.words.length;
        var found = wordfinder.wordlist.found.length;
        var results = found+' of '+words;
        this.update('You resigned. You found '+results+' words.');
        $("#results").addClass('resigned');
      },

      clear: function(){
        $('#results').removeClass();
        this.update('Ready to Play!');
      }      
      
    },

    /**
     * list of words to find
     * checks game completion
     */    
    wordlist:{
      
      words: data.wordlist,
      
      found: [],
      
      create: function(){

        var display = $('<ul></ul>')
                        .attr('id', 'wordlist');
        $('#wordlist-subcontainer')
          .append(display);

        for(var i in data.wordlist){
          var word = $('<li>'+data.wordlist[i]+'</li>')
                        .addClass('word');
          display.append(word);
        }
      },
      
      isInList: function(word){
        var index = this.words.indexOf(word);
        if(index != -1){ 
          this.found.push(word);
          return true;
        }else return false;
      },
      
      crossOffList: function(word){
        $('li.word').each(function(i, el){
          if($(el).text() == word){
            $(el).html('<strike>'+word+'</strike>');
          }
        })
      },
      
      isGameCompleted: function(){
        return this.words.length == this.found.length;
      },

      reset: function(){
        this.found = [];
      }

    },

    /**
     * Gameboard w/ lettered tiles
     */    
    gameboard: {
      
      state: 'startup', // startup, waiting, selectA, selectB
      
      selected_a: [],
      
      selected_b: [],
      
      create: function(){
        
        this.state = 'waiting'
        
        var board = $('<table></table>')
                      .attr('id','gameboard');
        $('#gameboard-subcontainer').append(board);

        function makeGamesquare(x,y,letter){
          return $('<td>'+letter+'</td>')
                  .data('x',x)
                  .data('y',y)
                  .on('mousedown',  wordfinder.gameboard.selectA)
                  .on('mouseup',    wordfinder.gameboard.selectB)
                  .on('mouseenter', wordfinder.gameboard.isInLine)
                  .on('mouseleave', wordfinder.gameboard.clearInLine);       
        }
        
        for(var i in data.gameboard){
          board.append('<tr></tr>');
          
          for(var j in data.gameboard[i]){
            var letter     = data.gameboard[i][j];
            var gamesquare = makeGamesquare(j,i,letter);
            board
              .find('tr:eq('+i+')')
              .append(gamesquare);

          }
        }
        
        // reset board if mouse leaves gameboard
        $("#gameboard")
          .on('mouseleave', wordfinder.gameboard.resetBoard);
        
        // once created, we have to give this element width and height for
        // proper page layout
        $('#gameboard-subcontainer')
          .css('height', $("#gameboard").height()+"px")
          .css('width', $("#gameboard").width()+"px");
      },

      selectA: function(){
          var el = $(this);
          el.addClass('selectA');
          wordfinder.gameboard.state = 'selectA';
          wordfinder.gameboard.selected_a = [el.data('x'), el.data('y')]       
      },

      selectB: function(){
          var el = $(this);
          if(el.hasClass('outofline') ||
             el.hasClass('selectA')){
            wordfinder.gameboard.resetBoard();
            return;
          }
          wordfinder.gameboard.state = 'selectB';
          wordfinder.gameboard.selected_b = [el.data('x'), el.data('y')]          
          var is_word = wordfinder.gameboard.checkWord();
          if(is_word){
            wordfinder.gameboard.state = 'waiting';
            if(wordfinder.wordlist.isGameCompleted()){
              wordfinder.resultsboard.indicateComplete();
            }
            wordfinder.gameboard.resetBoard();
          }else{
            wordfinder.gameboard.state = 'waiting';
          }        
      },

      isInLine: function(){

        var state = wordfinder.gameboard.state;
        if(state == 'waiting') return;
        
        var selected_a = wordfinder.gameboard.selected_a;
        var thissquare = [$(this).data('x'), $(this).data('y')];

        if(selected_a[0] == thissquare[0] ||
           selected_a[1] == thissquare[1] ||
           Math.abs(selected_a[0] - thissquare[0]) == Math.abs(selected_a[1] - thissquare[1])){
          wordfinder.gameboard.highlightDraggedSelection(selected_a,thissquare);
        }else{
          $(this).addClass('outofline');
        }
        
      },

      clearInLine: function(){
        wordfinder.gameboard.clearDraggedSelection();
        $(this).removeClass('outofline');
      },
      
      checkWord: function(){
        
        var selected_a    = wordfinder.gameboard.selected_a;
        var selected_b    = wordfinder.gameboard.selected_b;
        var selected_word = this.getWord(selected_a, selected_b);
       
        wordfinder.gameboard.clearDraggedSelection();
       
        if(wordfinder.wordlist.isInList(selected_word)){ // if found
          console.log('found a word')
          wordfinder.canvas.circleWord(selected_a, selected_b);
          wordfinder.wordlist.crossOffList(selected_word);
          return true;
        }else{ // if not found
          console.log(selected_word+' is not a word on the list.')
          wordfinder.gameboard.resetBoard();
          return false;
        }
      },

      /**
       * determines word within the two selected points
       */ 
      getWord: function(selected_a, selected_b){
        
        var wordarr     = [];
        var coordinates = lineMath(selected_a, selected_b);

        for(var i in coordinates){
          var c = coordinates[i];
          var letter = $('tr:eq('+c[1]+') td:eq('+c[0]+')').text();
          wordarr.push(letter);
        }
        var word = wordarr.join('');
        
        return word;
      },

      /**
       * highlight all squares between coordinates. should only be triggered
       * after confirmation that line is straight (in this case)
       */
      highlightDraggedSelection(A,B){
        var coordinates = lineMath(A,B);
          for(var i in coordinates){
            var c = coordinates[i];
            $('tr:eq('+c[1]+') td:eq('+c[0]+')').addClass('dragged-selection');
        }
      },

      clearDraggedSelection(){
        $('td').removeClass('dragged-selection');
      },

      resetBoard: function(){
        console.log('resetBoard')
        $('td').removeClass();
        wordfinder.gameboard.clearDraggedSelection();
        wordfinder.gameboard.state = 'waiting';
      },
      
      lock: function(){
        this.resetBoard();
        $('td').off();
      }
      
    },
    
    /**
     * found word highlight
     */
    canvas:{
      
      create: function(){
        
        var canvas = $('<canvas></canvas>')
                        .attr('id','gamecanvas');
        $('#gameboard-subcontainer').append(canvas);
        
        var top    = $("#gameboard").position().top;
        var left   = $("#gameboard").css('margin', '0 auto');
        var height = $("#gameboard").height() - 2;
        var width  = $("#gameboard").width() - 2;
        $("#gamecanvas")
          .css('top', top+'px')
          .css('left', left+'px')
          .css('width', width+'px')
          .css('height', height+'px')
          .attr('width', width)
          .attr('height', height);
      },
      
      circleWord: function(A,B){
        console.log('circleword');
        console.log(A,B)
        
        function f(n){
          return (n*26)+13;
        }
        A = [f(A[0]), f(A[1])];
        B = [f(B[0]), f(B[1])];

        var c   = document.getElementById("gamecanvas");
        var ctx = c.getContext("2d");
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineWidth = 20;
        ctx.strokeStyle = this.rainbow(20,Math.floor(Math.random() * 20) + 1  );
        ctx.moveTo(A[0],A[1]);
        ctx.lineTo(B[0],B[1]);
        ctx.stroke();
      },
      
      rainbow: function(numOfSteps, step) {
        // This function generates vibrant, "evenly spaced" colours (i.e. no clustering).
        // Adam Cole, 2011-Sept-14
        // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
        var r, g, b;
        var h = step / numOfSteps;
        var i = ~~(h * 6);
        var f = h * 6 - i;
        var q = 1 - f;
        switch(i % 6){
          case 0: r = 1; g = f; b = 0; break;
          case 1: r = q; g = 1; b = 0; break;
          case 2: r = 0; g = 1; b = f; break;
          case 3: r = 0; g = q; b = 1; break;
          case 4: r = f; g = 0; b = 1; break;
          case 5: r = 1; g = 0; b = q; break;
        }
        var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
        return (c);
      },
      
      clear: function(){
        $("#gamecanvas").remove();
        this.create();
      }
    }
    
  }
  
  wordfinder.init();
  
})(data, lineMath)
