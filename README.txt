git clone https://github.com/christseng89/Microservices-with-Node-JS-and-React.git
minikube start
minikube addons enable ingress

minikube ip
  192.168.59.100 ***
notepad c:\Windows\System32\Drivers\etc\hosts
  192.168.59.100 posts.com 

cd k8s
kubectl apply -f .

// Broswer
posts.com

### Test/Develop React App in Local with minikube
cd blog\client-async
set REACT_APP_HOST=k8s 
npm start
