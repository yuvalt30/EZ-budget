from scipy import stats
import sys
from ast import literal_eval

if __name__ == '__main__':

    i = sys.argv[1]
    data = literal_eval(i)

    x = [i for i in range(len(data))]
    slope, intercept, r, p, std_err = stats.linregress(x, data)

    def myfunc(x):
        return slope * x + intercept

    speed = myfunc(len(data)+1)
    print(speed)
