import $ from 'jquery';
import { observable, autorun } from 'mobx';
import PQueue from 'p-queue';

const queue = new PQueue({concurrency: 4});
const waiting = observable.box(0);
const processing = observable.box(0);
const done = observable.box(0);

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const startTask = async () => {
  processing.set(processing.get() + 1);
  waiting.set(queue.size);
  await wait(3000);
  processing.set(processing.get() - 1);
  done.set(done.get() + 1);
  waiting.set(queue.size);
};

const makeGraphRectsHtml = amount => {
  return [...Array(amount)].map(() => '<div class="StatusBox_GraphRect"></div>');
};

autorun(() => {
  const waitingCount = waiting.get();
  const processingCount = processing.get();
  const doneCount = done.get();
  $('#waiting').text(waitingCount);
  $('#waiting-graph').html(makeGraphRectsHtml(waitingCount));
  $('#processing').text(processingCount);
  $('#processing-graph').html(makeGraphRectsHtml(processingCount));
  $('#done').text(doneCount);
  $('#done-graph').html(makeGraphRectsHtml(doneCount));
});

$(document).ready(() => {
  $('#add').click(() => {
    queue.add(() => startTask());
    waiting.set(queue.size);
  });
});
