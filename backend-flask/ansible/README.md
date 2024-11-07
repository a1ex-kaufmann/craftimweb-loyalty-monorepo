```
ansible-playbook -i inventory.yml 1_install_all.yml \
  -e "ansible_host=$ANSIBLE_HOST" \
  -e "ansible_user=$ANSIBLE_USER" \
  -e "ansible_password=$ANSIBLE_PASSWORD"
```

```
ansible-playbook -i inventory.yml 2_clone_repo.yml \
  -e "ansible_host=$ANSIBLE_HOST" \
  -e "ansible_user=$ANSIBLE_USER" \
  -e "ansible_password=$ANSIBLE_PASSWORD"
```