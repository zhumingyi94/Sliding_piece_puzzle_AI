export const matrixize = inp => {
  const rowOne = [],
    rowTwo = [],
    rowThree = [],
    rowFour = [],
    rowFive = [];
  inp.forEach((x, index) => {
    if (index < 5) {
      rowOne.push(x);
    } else if (index < 10) {
      rowTwo.push(x);
    } else if (index < 15) {
      rowThree.push(x);
    } else if (index < 20) {
      rowFour.push(x);
    } else {
      rowFive.push(x);
    }
  });
  return [rowOne, rowTwo, rowThree, rowFour, rowFive];
};

const getCoordinate = x => {
  return [Math.trunc(x / 5), x % 5];
};

const getIndex = (i, j) => {
  return i * 5 + j;
};

const canMoveUp = (i, j) => i > 0;
const canMoveDown = (i, j) => i < 4;
const canMoveLeft = (i, j) => j > 0;
const canMoveRight = (i, j) => j < 4;

const swapElements = (array, index1, index2) => {
  let temp = array[index1];
  array[index1] = array[index2];
  array[index2] = temp;
};
const findElementIndex = (flatMatrix, value) => {
  let res = 0;
  flatMatrix.forEach((x, i) => {
    if (x === value) {
      res = i;
    }
  });
  return res;
};

const getAllStates = flatMatrix => {
  let newStates = [];
  flatMatrix.forEach((value, index) => {
    if (value === 0) {
      const i = getCoordinate(index)[0];
      const j = getCoordinate(index)[1];
      if (canMoveUp(i, j)) {
        let newState = flatMatrix.map(x => x);
        const newIdx = getIndex(i - 1, j);
        swapElements(newState, index, newIdx);
        newStates.push(newState);
      }
      if (canMoveDown(i, j)) {
        let newState = flatMatrix.map(x => x);
        const newIdx = getIndex(i + 1, j);
        swapElements(newState, index, newIdx);
        newStates.push(newState);
      }
      if (canMoveLeft(i, j)) {
        let newState = flatMatrix.map(x => x);
        const newIdx = getIndex(i, j - 1);
        swapElements(newState, index, newIdx);
        newStates.push(newState);
      }
      if (canMoveRight(i, j)) {
        let newState = flatMatrix.map(x => x);
        const newIdx = getIndex(i, j + 1);
        swapElements(newState, index, newIdx);
        newStates.push(newState);
      }
    }
  });
  return newStates;
};

export const getManhattanDistance = (thisState, otherState) => {
  let dist = 0;
  thisState.forEach((value, index) => {
    const [i, j] = getCoordinate(index);
    const newIndex = findElementIndex(otherState, value);
    const [x, y] = getCoordinate(newIndex);
    dist += Math.abs(i - x) + Math.abs(j - y);
  });
  return dist;
};

class Node {
  constructor() {
    this.parentNode = null;
    this.f = 0;
    this.g = 0;
    this.h = 0;
  }
}

class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  isEmpty() {
    return this.elements.length === 0;
  }

  push(item, priority) {
    const node = { item, priority };
    this.elements.push(node);
    this.bubbleUp(this.elements.length - 1);
  }

  pop() {
    if (this.isEmpty()) {
      throw new Error('Priority queue is empty');
    }

    if (this.elements.length === 1) {
      return this.elements.pop().item;
    }

    const min = this.elements[0];
    this.elements[0] = this.elements.pop();
    this.bubbleDown(0);
    return min.item;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.elements[index].priority < this.elements[parentIndex].priority) {
        this.swap(index, parentIndex);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  bubbleDown(index) {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (
        leftChild < this.elements.length &&
        this.elements[leftChild].priority < this.elements[smallest].priority
      ) {
        smallest = leftChild;
      }

      if (
        rightChild < this.elements.length &&
        this.elements[rightChild].priority < this.elements[smallest].priority
      ) {
        smallest = rightChild;
      }

      if (smallest !== index) {
        this.swap(index, smallest);
        index = smallest;
      } else {
        break;
      }
    }
  }

  swap(a, b) {
    const temp = this.elements[a];
    this.elements[a] = this.elements[b];
    this.elements[b] = temp;
  }

  contains(item) {
    return this.elements.some(element => element.item === item);
  }

  size() {
    return this.elements.length;
  }
}

export function AStar(initialState, goalState) {
  const openSet = new PriorityQueue();
  const closedSet = new Set();

  const startNode = new Node();
  startNode.item = initialState;
  startNode.g = 0;
  startNode.h = getManhattanDistance(initialState, goalState);
  startNode.f = startNode.g + startNode.h;

  openSet.push(startNode, startNode.f);

  while (!openSet.isEmpty()) {
    const currentNode = openSet.pop();
    const currentBoard = currentNode.item;

    if (JSON.stringify(currentBoard) === JSON.stringify(goalState)) {
      // Found the goal state, backtrack to construct the solution
      const solution = [];
      let current = currentNode;

      while (current) {
        solution.push(current.item);
        current = current.parentNode;
      }

      return solution.reverse();
    }

    closedSet.add(JSON.stringify(currentBoard));

    const neighborStates = getAllStates(currentBoard);

    for (const neighborState of neighborStates) {
      if (!closedSet.has(JSON.stringify(neighborState))) {
        const neighborNode = new Node();
        neighborNode.item = neighborState;
        neighborNode.parentNode = currentNode;
        neighborNode.g = currentNode.g + 1;
        neighborNode.h = getManhattanDistance(neighborState, goalState);
        neighborNode.f = neighborNode.g + neighborNode.h;

        if (
          !openSet.contains(neighborState) ||
          neighborNode.g < currentNode.g
        ) {
          openSet.push(neighborNode, neighborNode.f);
        }
      }
    }
  }

  // No solution found
  return null;
}

