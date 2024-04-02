# Deployment instructions

Simple step-by-step guide on how to deploy Zilliqa/otterscan on
both ZQ1 and ZQ2 infrastructure.

For ZQ1 you have to reproduces the steps below for each ZQ1 deployment
(devnet, testnet and mainnet).

# ZQ1 - Otterscan deployment

### 1 - connect to the relevant bastion host

 * Log in: `gcloud auth login --update-adc`
 * SSH into the bastion:

    * mainnet: gcloud compute ssh --zone asia-southeast1-a vm-p-zq1-mainnet-bastion-ase1 --tunnel-through-iap --project prj-p-zq1-mainnet-r93y8kg5

    * testnet: gcloud compute ssh vm-d-zq1-testnet-bastion-ase1 --zone asia-southeast1-a --project=prj-d-zq1-testnet-mddymaog


    * devnet: gcloud compute ssh vm-d-zq1-testnet-bastion-ase1 --zone asia-southeast1-a --project=prj-d-zq1-testnet-mddymaog

 * Switch to the `devops` user: `sudo su - devops`

### 2 - change to the `testnet` directory

 * `cd testnet`

### 3 - update the deployment manifests for the running ZQ1 instance

* Switch into the running instance directory: `cd <network-name>`
* Create a backup of the otterscan deployment manifest: `cp -vp manifest/otterscan.yaml{,.$(date +%Y%m%d)}`
* Update the manifest image to the version you want to deploy, or latest to pick up always the `latest` published from the stable `main` branch. here the snippet on how you do it:
```
-x-
spec:
      containers:
        - name: otterscan
          image: zilliqa/otterscan:latest
          imagePullPolicy: Always
-x-
```
* Replace the running deployment manifest: `./testnet.sh replace otterscan`

### 4 - update the pod
* Take the cluster context for the deployment you want update: `grep primary_cluster_name ./testnet.sh`
* Get the otterscan pod name: `kubectl get po --context=<cluster name from above command> | grep otterscan`
* Delete the old otterscan pod:
```
kubectl delete po --context=<cluster name from above command> <otterscan pod name>
```

# TODO

[] Create the ZQ2 deployment procedure