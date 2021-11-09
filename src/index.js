const jsdom = require('jsdom');

const urlFlibusta = 'http://flibusta.is';
const search = '/booksearch';
// const proxy = 'https://cors-anywhere.herokuapp.com/';
// const proxy2 = 'https://crossorigin.me/';
// const proxy3 = 'http://cors-proxy.htmldriven.com/?url=';
const proxy4 = 'http://www.whateverorigin.org/get?url=';

const cleanUpString = (string) => string.replaceAll('"', '').replaceAll('\\', '');

const fetchFlibusta = async (name, isDetailedBook = false) => {
  let url = new URL(urlFlibusta + search);

  url.searchParams.set('ask', name);
  url.searchParams.set('chb', 'on');

  if (isDetailedBook) {
    url = urlFlibusta + name;
    url = cleanUpString(url);
  }

  const response = await fetch(proxy4 + url);
  const fetchData = await response.text();
  return fetchData;
};

const { JSDOM } = jsdom;

const createDetailBook = async (name) => {
  const dom = new JSDOM(await fetchFlibusta(name, true));

  const arr = [];

  const nodeList = dom.window.document.querySelectorAll('a');

  nodeList.forEach(node => {
    const obj = {};
    obj.link = cleanUpString(node.href);
    arr.push(obj);
  });

  const book = arr.find(book => book.link.includes('epub'));

  if (document.querySelector('ul')) {
    document.querySelector('ul').remove();
  }

  if (document.querySelector('a')) {
    document.querySelector('a').remove();
  }

  const link = document.createElement('a');
  link.textContent = 'Download Epub';
  link.href = `http://flibusta.is${book.link}`;
  document.body.appendChild(link);
};

const createList = async (name) => {
  const dom = new JSDOM(await fetchFlibusta(name));

  const arr = [];

  const nodeList = dom.window.document.querySelectorAll('a');

  nodeList.forEach(node => {
    const obj = {};
    obj.name = node.textContent;
    obj.link = cleanUpString(node.href);
    arr.push(obj);
  });

  const books = arr.filter(book => book.link.includes('/b/'));
  const authors = arr.filter(book => book.link.includes('/a/'));

  if (document.querySelector('ul')) {
    document.querySelector('ul').remove();
  }

  const ul = document.createElement('ul');

  books.forEach((book, index) => {
    const button = document.createElement('button');
    const li = document.createElement('li');
    button.textContent = `${book.name} - ${authors[index + 2].name} - ${book.link}}`;
    button.dataset.link = `http://flibusta.is${book.link}`;
    li.appendChild(button);
    ul.appendChild(li);

    button.onclick = () => {
      createDetailBook(book.link);
    };
  });

  document.body.appendChild(ul);
};

const createPageLayout = () => {
  const title = document.createElement('h1');
  title.textContent = 'Flibusta App';
  document.body.appendChild(title);

  const input = document.createElement('input');
  input.setAttribute('name', 'book');
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'book');
  document.body.appendChild(input);

  const button = document.createElement('button');
  button.textContent = 'find';
  document.body.appendChild(button);

  document.querySelector('button').onclick = () => {
    const name = document.querySelector('input').value;
    document.querySelector('input').value = '';
    createList(name);
  };
};

createPageLayout();
