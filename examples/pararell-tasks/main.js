import $ from 'jquery';
import { observable, autorun } from 'mobx';

const processing = observable.box(0);
const done = observable.box(0);

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const startTask = async () => {
  processing.set(processing.get() + 1);
  await wait(3000);
  processing.set(processing.get() - 1);
  done.set(done.get() + 1);
};

const makeGraphRectsHtml = amount => {
  return [...Array(amount)].map(() => '<div class="StatusBox_GraphRect"></div>');
};

autorun(() => {
  const processingCount = processing.get();
  const doneCount = done.get();
  $('#processing').text(processingCount);
  $('#processing-graph').html(makeGraphRectsHtml(processingCount));
  $('#done').text(doneCount);
  $('#done-graph').html(makeGraphRectsHtml(doneCount));
});

$(document).ready(() => {
  $('#add').click(() => {
    startTask();
  });
});
