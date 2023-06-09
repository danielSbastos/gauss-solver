from __future__ import print_function
from fractions import Fraction
import numpy as np
import sympy as sp
import math
from io import StringIO

def main():
	# for i in range (n):
	# 	temp = raw_input()
	# 	temp = temp.split(" ")
	# 	for j in range(n+1):
	# 		A[i][j] = Fraction(temp[j])

	calc_y(n)

def swap(s1, s2):
	return s2, s1

def swap_row(j,k):
	for i in range(k,n+1):
		(A[j][i], A[k][i]) = swap(A[j][i], A[k][i])

def print_aug():
	for i in range(n):
		for j in range(n):
			print ("%10.5f" %float(A[i][j]), end = " ", file=output)
		print (" | %10.5f" %float(A[i][j+1]), end = " ", file=output)
		print(file=output)
	print(file=output)

def print_ans():
	for i in range(n):
		print("x" + str(i+1) + " : " + str(float(y[i])), file=output)

def calc_y(n):
	flag = 0
	# print_aug()
	for k in range(n-1):
		count = 0
		col = k
		pivot = k
		for j in range(k,n):
			if(A[j][k] == 0):
				count += 1
			if(math.fabs(A[j][k]) > math.fabs(A[pivot][k])):
				pivot = j
		if count == n-k:
			while(1):
				pivot = k
				count = 0
				for j in range(k,n):
					if(A[j][col] == 0):
						count += 1
					if(math.fabs(A[j][k]) > math.fabs(A[pivot][k])):
						pivot = j
				if(count == n-k):
					if(col < n):
						col += 1
						print(col, file=output)
						continue
					else:
						break
				else:
					print(col, file=output)
					break
		if col < n :
			swap_row(pivot,k)
			for j in range(k+1,n):
				mf = Fraction(A[j][col]/A[k][col])
				for t in range(col,n+1):
					A[j][t] = Fraction(Fraction(A[j][t]) - Fraction(mf* A[k][t]))
		print("Matriz aumentada | " +str(k+1)+ " Iteração: \n ", file=output)
		print_aug()

	if A[n-1][n-1] == 0 and A[n-1][n] != 0 :
		print("Sem solução!", file=output)
		return

	if A[n-1][n-1] == 0 :
		print("Existem infinitas soluções!", file=output)
		return

	for i in range(n):
		count_b = 0
		for j in range(n):
			if(A[i][j] == 0):
				count_b += 1
		if(count_b == n):
			flag = 1
			if(A[n-1][n] != 0):
				print("Sem solução!", file=output)
				return

	if(flag == 1):
		print("Existem infinitas soluções!", file=output)
		return

	y[n-1] = Fraction(A[n-1][n]/A[n-1][n-1])
	for i in range(n-2,-1,-1):
		back_subs = 0
		for j in range(i+1,n):
			back_subs += Fraction(y[j]*A[i][j])
		y[i] = (Fraction(A[i][n] - back_subs)/A[i][i])
	return print_ans()

#main()

from flask import Flask, request, render_template, jsonify

app = Flask(__name__)
@app.route('/')
def hello():
	global A, n, y, output

	output = StringIO()

	x_s = request.args.get('x').split("|")
	x_s = list(map(lambda x: x.split(","), x_s))

	y = request.args.get('y').split(",")

	n = len(x_s)
	A = [[0 for j in range(n+1)] for i in range(n)]
	
	for i in range(n):
		for j in range(n):
			A[i][j] = Fraction(float(x_s[i][j]))
		
		A[i][j+1] = Fraction(float(y[i]))

	main()

	return jsonify({'data': output.getvalue()})


@app.route('/resolver')
def solver():
	return render_template('index.html')
