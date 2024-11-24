#include <iostream>
using namespace std;

bool isValid(int a[9][9],int r,int c,int num){
    
    for(int i=0; i<9; i++){
          if(a[r][i]==num || a[i][c]==num)return false;
           if(a[3*(r/3)+(i/3)][3*(c/3)+(i%3)]==num)return false;
    }

    return true;
}

bool solveSudoco(int a[9][9]){

    for(int i=0; i<9; i++){
        for(int j=0; j<9; j++){
          
          if(a[i][j]==0){

            for(int num=1; num<10; num++){
                 if(isValid(a,i,j,num)){
                    a[i][j]=num;
                   bool ans= solveSudoco(a);
                   if(ans)return true;
                    a[i][j]=0;
                 }
            }
            return false;
          }
            
        }
    }
    return true;
}

int main() {
    // Initialize a 9x9 Sudoku board with a test case
    int a[9][9] = {
        {5, 3, 0, 0, 7, 0, 0, 0, 0},
        {6, 0, 0, 1, 9, 5, 0, 0, 0},
        {0, 9, 8, 0, 0, 0, 0, 6, 0},
        {8, 0, 0, 0, 6, 0, 0, 0, 3},
        {4, 0, 0, 8, 0, 3, 0, 0, 1},
        {7, 0, 0, 0, 2, 0, 0, 0, 6},
        {0, 6, 0, 0, 0, 0, 2, 8, 0},
        {0, 0, 0, 4, 1, 9, 0, 0, 5},
        {0, 0, 0, 0, 8, 0, 0, 7, 9}
    };

    // Printing the Sudoku board to verify the test case

    solveSudoco(a);
    cout << "Sudoku Board:" << endl;
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            cout << a[i][j] << " ";
        }
        cout << endl;
    }

    return 0;
}
