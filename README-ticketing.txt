### ticketing.com Installation Notes ...
minikube stop
minikube delete --purge
minikube start --memory 8192 --disk-size 50GB
minikube addons enable ingress
minikube ip
  192.168.59.102
notepad c:\Windows\System32\Drivers\etc\hosts
  192.168.59.102  ticketing.com
ping ticketing.com
  Pinging ticketing.com [192.168.59.102] with 32 bytes of data:
  Reply from 192.168.59.102: bytes=32 time=2ms TTL=64
  ...

cd ticketing
### VERY Important !!!
// Change the stripe-key.ts to a valid stripe-key
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=sk_test_xxxx
  secret/stripe-secret created 

skaffold dev

### Postman
= Signup
= New Ticket
= New Order
= New payment

*** NOTES minikube
### Minikube wsarecv: A connection attempt failed because the connected party 
    did not properly respond after a period of time, or established connection 
    failed because connected host has failed to respond.
https://minikube.sigs.k8s.io/docs/handbook/vpn_and_proxy/
set NO_PROXY=localhost,127.0.0.1,10.96.0.0/12,192.168.59.0/24,192.168.59.1/24,192.168.49.0/24,192.168.39.0/24
minikube start
