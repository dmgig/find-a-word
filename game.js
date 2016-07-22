(function(data){
  'use strict';
  
  console.log(data);
  
  var wordfinder = {
    init: function(){
      console.log('init');
      wordfinder.wordlist.create();
      wordfinder.gameboard.create();
      wordfinder.controls.create();
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
    
    controls:{
      create: function(){
        $('#reset').off().on('click', wordfinder.reset);
        $('#resign').off().on('click', wordfinder.resign);
      }
    },
    
    wordlist:{
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
      }
    },
    
    gameboard: {
      state: 'startup',
      selectedA: [],
      selectedB: [],
      create: function(){
        
        this.state = 'waiting'
        var board = $('<table></table>')
                      .attr('id','gameboard');
        $('#gameboard-container')
          .append(board);
        
        for(var i in data.gameboard){
          
          board.append('<tr></tr>');
          
          for(var j in data.gameboard[i]){
            var letter     = data.gameboard[i][j];
            var gamesquare = $('<td>'+letter+'</td>')
                                .data('x',i)
                                .data('y',j)
                                .on('click', wordfinder.gameboard.select)
                                .on('mouseenter', wordfinder.gameboard.isInLine)
                                .on('mouseleave', wordfinder.gameboard.clearInLine); 
                                
            board
              .find('tr:eq('+i+')')
              .append(gamesquare);

          }
        }
      },
      
      select: function(){
        console.log($(this));
        
        var state = wordfinder.gameboard.state;
        
        if(state == 'waiting'){
          $(this).addClass('selectA');
          wordfinder.gameboard.state = 'selectA';
          wordfinder.gameboard.selectedA = [$(this).data('x'), $(this).data('y')]
        }else if(state == 'selectA'){
          
        }else if(state == 'selectB'){
          
        }
      },
      
      isInLine: function(){
        
        var state = wordfinder.gameboard.state;
        if(state != 'selectA') return;
        
        var selectedA = wordfinder.gameboard.selectedA;
        var thissquare = [$(this).data('x'), $(this).data('y')];
        
        console.log(selectedA);
        console.log(thissquare);
        
        if(selectedA[0] == thissquare[0] ||
           selectedA[1] == thissquare[1] ||
           selectedA[0] - thissquare[0] == selectedA[1] - thissquare[1]){
            $(this).addClass('inline');
        }else{
            $(this).addClass('outofline');
        }
        
      },
      
      clearInLine: function(){
        $(this).removeClass('inline');
        $(this).removeClass('outofline')
      },
      
      checkWord: function(selectedA, selectedB){
        
      },
      
      selectB: function(gamesquare){
        
      }
      
    }
    
    
    
    
  }
  
  wordfinder.init();
  
})(data)
