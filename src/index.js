module.exports = function solveSudoku(matrix) {
    var size = matrix.length;
    let possibleValues = [];
    
    while(ZerosCount() != 0) {
        for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                if(matrix[i][j] == 0) {
                    let index = i * size + j;
                    possibleValues[index] = [];
                    for(let num = 1; num <= size; num++) {
                        if(!IsHasInColumn(num, j) && !IsHasInLine(num, i) && !IsHasInRect(num, i, j)) {
                          possibleValues[index].push(num);
                        }
                    }
                    
                    if(possibleValues[index] != undefined && possibleValues[index].length > 0) {                    
                        matrix[i][j] = possibleValues[index];
                    }
                }
            }
        }
    }
    
    /*
        for(let i = 2; i < size; i += 3) {
            for(let j = 2; j < size; j += 3) {
                //running to sectors
                //search max possibleValues
                let maxPossibleValuesCount = 0;
                for(let columnInRect = j; columnInRect > j - 3; columnInRect--) {
                    for(let lineInRect = i; lineInRect > i - 3; lineInRect--) {
                        let index = lineInRect * size + columnInRect;
                        if(possibleValues[index] != undefined && possibleValues[index].length > maxPossibleValuesCount) {
                            maxPossibleValuesCount = possibleValues[index].length;
                        }
                    }
                }
                
                while (maxPossibleValuesCount > 1) {
                    //found pares of %maxPossibleValuesCount% size
                    
                    let maxCountIndex = -1;
                    let countIndexesWithMaxIndexesCount = 0;
                    for(let columnInRect = j; columnInRect > j - 3; columnInRect--) {
                        for(let lineInRect = i; lineInRect > i - 3; lineInRect--) {
                            let index = lineInRect * size + columnInRect;
                            if(possibleValues[index] != undefined && possibleValues[index].length == maxPossibleValuesCount) {
                                countIndexesWithMaxIndexesCount++;
                                
                                //remember first maxCount index
                                if(maxCountIndex == -1) {
                                    maxCountIndex = index;
                                }
                            }
                        }
                    }
                    
                    let lastMaxCountIndex = -1;
                    while(countIndexesWithMaxIndexesCount != 0) {
                        
                        for(let columnInRect = j; columnInRect > j - 3; columnInRect--) {
                            for(let lineInRect = i; lineInRect > i - 3; lineInRect--) {
                                let index = lineInRect * size + columnInRect;
                                
                                //check if maxCount index - its next possible index
                                if(possibleValues[index] != undefined && possibleValues[index].length == maxPossibleValuesCount && lastMaxCountIndex == maxCountIndex) {
                                    maxCountIndex = index;
                                }
                            }
                        }
                        
                        let allParesIndexes = [];
                        for(let columnInRect = j; columnInRect > j - 3; columnInRect--) {
                            for(let lineInRect = i; lineInRect > i - 3; lineInRect--) {
                                let index = lineInRect * size + columnInRect;
                                if(possibleValues[index] != undefined && possibleValues[index].length > 1 && possibleValues[index].length <= maxPossibleValuesCount) {
                                    let hasAllLocalValues = true;
                                    
                                    for(let k = 0; k < possibleValues[index].length; k++) {
                                        if(!possibleValues[maxCountIndex].includes(possibleValues[index][k])) {
                                            hasAllLocalValues = false;
                                            break;
                                        }
                                    }
                                    
                                    if(hasAllLocalValues) {
                                        allParesIndexes.push(index);
                                    }
                                }
                            }
                        }

                        if(allParesIndexes.length == maxPossibleValuesCount) {
                            for(let columnInRect = j; columnInRect > j - 3; columnInRect--) {
                                for(let lineInRect = i; lineInRect > i - 3; lineInRect--) {
                                    let index = lineInRect * size + columnInRect;
                                    if(possibleValues[index] != undefined && possibleValues[index].length > 1 && !allParesIndexes.includes(index)) {
                                        for(let posValueIndex = 0; posValueIndex < possibleValues[index].length; posValueIndex++) {
                                            if(possibleValues[maxCountIndex].includes(possibleValues[index][posValueIndex])) {
                                                possibleValues[index].splice(posValueIndex, 1);
                                            }
                                        }
                                    }
                                }
                            }
                            
                            if(allParesIndexes.length <= 3) {
                                let inRow = true;
                                let inColumn = true;
                                for(let posValueIndex = 1; posValueIndex < allParesIndexes.length; posValueIndex++) {
                                    inRow &= LineFromIndex(allParesIndexes[posValueIndex]) == LineFromIndex(allParesIndexes[posValueIndex - 1]);
                                    inColumn &= ColumnFromIndex(allParesIndexes[posValueIndex]) == ColumnFromIndex(allParesIndexes[posValueIndex - 1]);
                                }
                                
                                if(inRow) {
                                    for(let columnIndex = 0; columnIndex < size; columnIndex++) {
                                        let newIndex = LineFromIndex(allParesIndexes[0]) * size + columnIndex;
                                        if(possibleValues[newIndex] != undefined && possibleValues[newIndex].length > 1 && !allParesIndexes.includes(newIndex)) {
                                            for(let posValueIndex = 0; posValueIndex < possibleValues[newIndex].length; posValueIndex++) {
                                                if(possibleValues[maxCountIndex].includes(possibleValues[newIndex][posValueIndex])) {
                                                    possibleValues[newIndex].splice(posValueIndex, 1);
                                                }
                                            }
                                        }
                                    }
                                } else if(inColumn) {
                                    for(let lineIndex = 0; lineIndex < size; lineIndex++) {
                                        let newIndex = lineIndex * size + ColumnFromIndex(allParesIndexes[0]);
                                        if(possibleValues[newIndex] != undefined && possibleValues[newIndex].length > 1 && !allParesIndexes.includes(newIndex)) {
                                            for(let posValueIndex = 0; posValueIndex < possibleValues[newIndex].length; posValueIndex++) {
                                                if(possibleValues[maxCountIndex].includes(possibleValues[newIndex][posValueIndex])) {
                                                    possibleValues[newIndex].splice(posValueIndex, 1);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        lastMaxCountIndex = maxCountIndex;
                        countIndexesWithMaxIndexesCount--;
                    }
                   
                    
                    maxPossibleValuesCount--;
                }
                
                
            }
        }
        
        RecalculatePossibleValues();
        
        CheckHiddenLoner();
        CheckInlinePossibleValues();
        CheckHiddenLoner();
        
//        RecalculatePossibleValues();
        */
    
    return matrix;   
        
    
    function RecalculatePossibleValues() {
        for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                let index = i * size + j;
                if(possibleValues[index] != undefined && possibleValues[index].length > 0) {                    
                    matrix[i][j] = possibleValues[index][0];
                }
            }
        }
    }
    
    
    function ZerosCount() {
        let zerosCount = 0;
        
        for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                if(matrix[i][j] == 0) {
                    zerosCount++;
                }
            }
        }
        
        return zerosCount;
    }
    
    
    function IsHasInLine(num, line) {
        return matrix[line].includes(num);
    }
    
    
    function IsHasInColumn(num, column) {
        for(let line = 0; line < size; line++) {
            if(matrix[line][column] == num) return true;
        }
        
        return false;
    }
    
    
    function IsHasInRect(num, line, column) {
        let endI = getEndI(line);
        let endJ = getEndJ(column);
                
        for(let columnInRect = endJ; columnInRect > endJ - 3; columnInRect--) {
            for(let lineInRect = endI; lineInRect > endI - 3; lineInRect--) {
                if(matrix[lineInRect][columnInRect] == num) return true;
            }
        }
        
        return false;
    }
    
    
    function getEndI(lineNum) {
        for(let i = lineNum; ; i++) {
            if((i + 1) % 3 == 0) {
                return i;
            }
        }
    }
    
    
    function getEndJ(clounmNum) {
        for(let j = clounmNum; ; j++) {
            if((j + 1) % 3 == 0) {
                return j;
            }
        }
    }
    
    
    function CheckOnError(checkMatrix, newIndex) {
        for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                if(checkMatrix[i][j] == 0 || (i * size + j == newIndex)) {
                    let localPossibleValues = [];
                    for(let num = 1; num <= size; num++) {
                        if(!IsHasInColumn(num, j) && !IsHasInLine(num, i) && !IsHasInRect(num, i, j)) {
                          localPossibleValues.push(num);
                        }
                    }
                    
                    if(localPossibleValues.length == 0) return true;
                }
            }
        }
        
        return false;
    }
    
    
    function CheckHiddenLoner() {
        for(let i = 2; i < size; i += 3) {
            for(let j = 2; j < size; j += 3) {
                let counter = GetCounterValues(i, j);
                
                for(let counterIndex = 0; counterIndex < size; counterIndex++) {
                    if(counter[counterIndex].length == 1) {
                        matrix[LineFromIndex(counter[counterIndex][0])][ColumnFromIndex(counter[counterIndex][0])] = counterIndex + 1;
                    }
                }
            }
        }
    }
    
    
    function CheckInlinePossibleValues() {
        for(let i = 2; i < size; i += 3) {
            for(let j = 2; j < size; j += 3) {
                let counter = GetCounterValues(i, j);

                for(let counterIndex = 0; counterIndex < size; counterIndex++) {
                    if(counter[counterIndex].length > 1) {
                        let inRow = true;
                        let inColumn = true;
                        for(let index = 1; index < counter[counterIndex].length; index++) {
                            inRow &= LineFromIndex(counter[counterIndex][index]) == LineFromIndex(counter[counterIndex][index - 1]);
                            inColumn &= ColumnFromIndex(counter[counterIndex][index]) == ColumnFromIndex(counter[counterIndex][index]);
                        }
                                                                        
                        if(inRow || inColumn) {
                            for(let index = 0; index < size; index++) {
                                let needIndex = inRow ? LineFromIndex(counter[counterIndex][0]) * size + index : ColumnFromIndex(counter[counterIndex][0]) + index * size;
//                                if(possibleValues[needIndex] != undefined && possibleValues[needIndex].includes(counterIndex + 1)) {
//                                    for(let posValueIndex = 0; posValueIndex < possibleValues[needIndex].length; posValueIndex++) {
//                                        if(possibleValues[needIndex][posValueIndex] == (counterIndex + 1)) {
//                                            possibleValues[needIndex].splice(posValueIndex, 1);
//                                        }
//                                    }
//                                }
                                if(possibleValues[needIndex] != undefined && possibleValues[needIndex].length > 1 && possibleValues[needIndex].includes(counterIndex + 1)) {
                                    for(let posValueIndex = 0; posValueIndex < possibleValues[needIndex].length; posValueIndex++) {
                                        if(possibleValues[needIndex][posValueIndex] == counterIndex + 1) {
                                            possibleValues[needIndex].splice(posValueIndex, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    
    function GetCounterValues(i, j) {
        let counter = [];
        for(let k = 0; k < size; k++) {
            counter[k] = [];
        }

        for(let columnInRect = j; columnInRect > j - 3; columnInRect--) {
            for(let lineInRect = i; lineInRect > i - 3; lineInRect--) {
                let index = lineInRect * size + columnInRect;
                if(possibleValues[index] != undefined && possibleValues[index].length != 0) {
                    for(let k = 0; k < possibleValues[index].length; k++) {
//                        if(!IsHasInRect(possibleValues[index][k]))
                            counter[possibleValues[index][k] - 1].push(index);
                    }
                }
            }
        }
        
        return counter;
    }    

}
