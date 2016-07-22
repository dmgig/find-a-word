(function(data, lineMath){
  'use strict';
  
  console.log(data);
  console.log(lineMath);
  
  var wordfinder = {
    
    init: function(){
      console.log('init');
      wordfinder.wordlist.create();
      wordfinder.gameboard.create();
      wordfinder.controls.create();
      wordfinder.resultsboard.create();
    },
    
    /**
     * basic game controls
     */
    controls:{
      create: function(){
        $('#reset').off().on('click', wordfinder.controls.reset);
        $('#resign').off().on('click', wordfinder.controls.resign);
      },
      reset: function(){
        console.log('reset');
        $("#wordlist-container").empty();
        $("#gameboard-container").empty();
        wordfinder.init();
      },
      resign: function(){
        console.log('resign');
        $("#wordlist-container").empty();
        $("#gameboard-container").empty();      
      },
      gameCompleted: function(){
        console.log('game-completed');
      },         
    },
    
    resultsboard: {
 
       create: function(){
        console.log('create results board');
        
        var display = $('<div></div>')
                        .attr('id', 'results');
        $('#results-container')
          .append(display);

        this.update('Ready to Play!');

      },
      
      update: function(update){
        $("#results").html(update);
      },
      
      indicateComplete: function(){
        this.update('You found all the words on this puzzle.');
        $("#results").addClass('completed');
      }
      
    },

    /**
     * list of words to find
     */    
    wordlist:{
      
      words: data.wordlist,
      
      found: [],
      
      create: function(){
        console.log('create wordlist');
        console.log('wordlist '+data.wordlist.length)
        
        var display = $('<div></div>')
                        .attr('id', 'wordlist');
        $('#wordlist-container')
          .append(display);

        for(var i in data.wordlist){
          var word = $('<span>'+data.wordlist[i]+'</span>')
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
        $('span.word').each(function(i, el){
          if($(el).text() == word){
            $(el).wrap('<strike></strike>');
          }
        })
      },
      
      isGameCompleted: function(){
        console.log('is game completed');
        console.log(this)
        return this.words.length == this.found.length;
      }

    },
    
    gameboard: {
      
      state: 'startup',
      
      selected_a: [],
      
      selected_b: [],
      
      create: function(){
        
        this.state = 'waiting'
        
        var board = $('<table></table>')
                      .attr('id','gameboard');
        $('#gameboard-container').append(board);
          
        function makeGamesquare(letter){
          return $('<td>'+letter+'</td>')
                  .data('x',i)
                  .data('y',j)
                  .on('click', wordfinder.gameboard.select)
                  .on('mouseenter', wordfinder.gameboard.isInLine)
                  .on('mouseleave', wordfinder.gameboard.clearInLine);          
        }
        
        for(var i in data.gameboard){
          board.append('<tr></tr>');
          
          for(var j in data.gameboard[i]){
            var letter     = data.gameboard[i][j];
            var gamesquare = makeGamesquare(letter);
            board
              .find('tr:eq('+i+')')
              .append(gamesquare);

          }
        }
      },
      
      select: function(){
        console.log($(this));
        
        // if selected is reeselected, remove selection
        if($(this).hasClass('selectA')){
          $(this).removeClass('selectA');
          wordfinder.gameboard.state = 'waiting';
          return;
        }
        
        var state = wordfinder.gameboard.state;
        console.log(state);
        
        if(state == 'waiting'){
          $(this).addClass('selectA');
          wordfinder.gameboard.state = 'selectA';
          wordfinder.gameboard.selected_a = [$(this).data('x'), $(this).data('y')]
        }else if(state == 'selectA'){
          if($(this).hasClass('outofline')) return;
          $(this).addClass('selectB');
          wordfinder.gameboard.state = 'selectB';
          wordfinder.gameboard.selected_b = [$(this).data('x'), $(this).data('y')]          
          var is_word = wordfinder.gameboard.checkWord();
          if(is_word){
            wordfinder.gameboard.state = 'waiting';
            if(wordfinder.wordlist.isGameCompleted()){
              wordfinder.resultsboard.indicateComplete();
            }
            wordfinder.gameboard.resetBoard();
          }else{
            alert('That is not a word.')
            $(this).removeClass('selectB');
            wordfinder.gameboard.state = 'selectA';
          }
          
        }else if(state == 'selectB'){
          
        }
      },
      
      isInLine: function(){
        
        var state = wordfinder.gameboard.state;
        if(state != 'selectA')          return;
        if($(this).hasClass('selectA')) return;
        
        var selected_a = wordfinder.gameboard.selected_a;
        var thissquare = [$(this).data('x'), $(this).data('y')];
        
        console.log(selected_a);
        console.log(thissquare);
        
        if(selected_a[0] == thissquare[0] ||
           selected_a[1] == thissquare[1] ||
           Math.abs(selected_a[0] - thissquare[0]) == Math.abs(selected_a[1] - thissquare[1])){
            $(this).addClass('inline');
        }else{
            $(this).addClass('outofline');
        }
        
      },

      clearInLine: function(){
        $(this).removeClass('inline');
        $(this).removeClass('outofline')
      },
      
      checkWord: function(){
        
        var selected_a = wordfinder.gameboard.selected_a;
        var selected_b = wordfinder.gameboard.selected_b;
        
        var selected_word = this.getWord(selected_a, selected_b);
        
        if(wordfinder.wordlist.isInList(selected_word)){
          console.log('found a word')
          wordfinder.gameboard.highlightWord(selected_a, selected_b);
          wordfinder.wordlist.crossOffList(selected_word);
          return true;
        }else{
          console.log('not a word')
          return false;
        }
      },

      getWord: function(selected_a, selected_b){
        
        var wordarr = []
        
        var coordinates = lineMath(selected_a, selected_b)

        for(var i in coordinates){
          var c = coordinates[i];
          var letter = $('tr:eq('+c[0]+') td:eq('+c[1]+')').text();
          wordarr.push(letter);
        }
        var word = wordarr.join('');
        console.log('word is: '+word);
        
        return word;
        
      },

      highlightWord(selected_a, selected_b){
        var coordinates = lineMath(selected_a, selected_b);
        for(var i in coordinates){
          var c = coordinates[i];
          $('tr:eq('+c[0]+') td:eq('+c[1]+')').addClass('foundMe');
        }        
      },
      
      resetBoard: function(){
        $('td').removeClass('selectA');
        $('td').removeClass('selectB');
        wordfinder.gameboard.state = 'waiting';
      }
      
    }
    
  }
  
  wordfinder.init();
  
})(data, lineMath)
