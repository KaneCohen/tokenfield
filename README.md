# Tokenfield

Input field with tagging/token/chip capabilities written in raw JavaScript.  
Tokens in OS X or Chips in Adnroid - small UI elements which are inserted into  
various inpt fields that often combine with autocomplete functionality.  

Tokens allow designers to display extra information about input. For example,  
in email applications when typing an email address of the recipient, input field  
could display fill name of the owner of a given email and a picture.

This Tokenfield implementation is written in raw JavaScript without any extra  
dependencies like jQuery.

## Examples

View live [examples here](https://kanecohen.github.io/tokenfield).

## Usage

### Via JavaScript

Tokenfield could be applied to any visible `<input />` element that allows users  
to input text or number.

````js
  // Given that we have following HTML element: <input class="my-input" />
  var tf = new Tokenfield({
    el: document.querySelector('.my-input')
  });
````

This action would create a Tokenfield wrapped around a given input element.  
Without additional options, this Tokenfield would allow users to add multiple  
token items without any specific restrictions. Only unique items are allowed, so  
it is not possible to add multiple items such as: "foo", "bar", "foo". Only first  
"foo" would be added and the last one discarded.  

## TODO

Add options, events, comments, gif demo, more demos on demo page.
