from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TaskSeralizer

from .models import Task
# Create your views here.
@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'List' : "/task-list",
        'Detail View' : "/task-detail/<str:pk>/",
        'Create' : "/task-create/",
        'Update': "/task-update/<str:pk>/",
        'Delete': "/task-delete/<str:pk>/"
    }
    return Response(api_urls)

@api_view(['GET'])
def taskList(request):
    tasks= Task.objects.all()
    seralizer = TaskSeralizer(tasks, many=True)
    return Response(seralizer.data)

@api_view(['GET'])
def taskDetail(request, pk):
    try:    
        tasks = Task.objects.get(id=pk)
        seralizer = TaskSeralizer(tasks, many=False)
        return Response(seralizer.data)
    except Exception as e:
        return Response("Object not found in database")
    
@api_view(['POST'])
def taskCreate(request):
	seralizer = TaskSeralizer(data=request.data)

	if seralizer.is_valid():
		seralizer.save()

	return Response(seralizer.data)

@api_view(['POST'])
def taskUpdate(request, pk):
	task = Task.objects.get(id=pk)
	seralizer = TaskSeralizer(instance=task, data=request.data)

	if seralizer.is_valid():
		seralizer.save()

	return Response(seralizer.data)


@api_view(['DELETE'])
def taskDelete(request, pk):
	task = Task.objects.get(id=pk)
	task.delete()

	return Response('Item succsesfully delete!')