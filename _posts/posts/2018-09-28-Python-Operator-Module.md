---
layout: post
title: Notifying the house about deliveries - Part 1
categories: posts
---

Python Operator Module

Python's operator module contains a set of functions correponding to the operators of the language, such as addition (+) or multiplication (*), but for example
also **abs**. Why would this be useful? If you want to write functional(ish) 
Python code, you can use these functions instead of the operators. Together with the
**functools** for higher-order functions one can cover basically all usecases 
for functional programming in Python. But even if your program is not written in a functional style, the operator module can be handy.

Two special functions from the operator module can be especially useful: **operator.attrgetter**
and **operator.itemgetter**. Let's see why.

operator.attrgetter(item)
From the Python documentation:
Return a callable object that fetches attr from its operand.
If more than one attribute is requested, returns a tuple of attributes.
The attribute names can also contain dots.

As an example, this can be used for an elegant solution, if you want to sort a collection of objects on an
attribute of the objects.

"""python
from operator import attrgetter

class Person:
  name = ""
  age = 0

  def __init__(self, name, age):
    self.name = name
    self.age = age

  def __str__(self):
    return "Name: {}, Age: {}".format(self.name,self.age)

list_of_persons = []
list_of_persons.append(Person("Wilhelm", 50))
list_of_persons.append(Person("Hans", 30))
list_of_persons.append(Person("Berta", 40))
list_of_persons.append(Person("Anna", 40))

print([str(person) for person in list_of_persons])

# Sort by name
list_of_persons = sorted(list_of_persons, key=attrgetter('name'))
print([str(person) for person in list_of_persons])

# Sort by age
list_of_persons = sorted(list_of_persons, key=attrgetter('age'))
print([str(person) for person in list_of_persons])

# Sort by age, then by name
list_of_persons = sorted(list_of_persons, key=attrgetter('age','name'))
print([str(person) for person in list_of_persons])
"""

operator.itemgetter(item)
From the Python documentation:
Return a callable object that fetches item from its operand using the operand’s __getitem__() method.
If multiple items are specified, returns a tuple of lookup values.

A very common usecase is retrieving specific fields from a collection of tuples:

"""python

"""
