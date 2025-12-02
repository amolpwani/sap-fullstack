# 🔑 SSH Key Setup for Multiple GitHub Accounts

## ✅ What Was Done

1. **Generated New SSH Key** for `amolpwani` account
   - Location: `C:\Users\amolp\.ssh\id_ed25519_amolpwani`
   - Type: ED25519 (modern, secure)
   - Email: amolpwani@github.com

2. **Created SSH Config** at `C:\Users\amolp\.ssh\config`
   - Manages multiple GitHub accounts
   - Keeps existing `spideads-amol` account intact
   - Adds new `amolpwani` account configuration

3. **Updated Git Remote** for this project
   - Uses specific SSH host: `github.com-amolpwani`
   - Points to: `amolpwani/sap-fullstack.git`

---

## 📋 Next Steps: Add SSH Key to GitHub

### Step 1: Copy Your Public SSH Key

**Your public SSH key is:**

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBPBVpUYnl7GBnyhqszmw1i3hFeN3udsS+bG2TMxL2MQ amolpwani@github.com
```

### Step 2: Add to GitHub Account

1. **Login to GitHub** as `amolpwani`
   - Go to: https://github.com/login

2. **Navigate to SSH Settings**
   - Click your profile picture (top right)
   - Go to: **Settings** → **SSH and GPG keys**
   - Or directly: https://github.com/settings/keys

3. **Add New SSH Key**
   - Click **"New SSH key"** button
   - **Title**: `SAP Fullstack Project - Windows PC`
   - **Key type**: Authentication Key
   - **Key**: Paste the public key (from above)
   - Click **"Add SSH key"**

4. **Confirm** by entering your GitHub password if prompted

### Step 3: Test SSH Connection

```bash
ssh -T git@github.com-amolpwani
```

You should see:
```
Hi amolpwani! You've successfully authenticated, but GitHub does not provide shell access.
```

### Step 4: Push Your Code

```bash
git push -u origin main
```

---

## 🔧 SSH Configuration Details

### File: `C:\Users\amolp\.ssh\config`

```
# GitHub account: spideads-amol (default)
Host github.com-spideads
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa

# GitHub account: amolpwani
Host github.com-amolpwani
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_amolpwani

# Default GitHub (uses spideads-amol)
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa
```

---

## 📚 How to Use Multiple Accounts

### For `amolpwani` repositories:

```bash
git remote add origin git@github.com-amolpwani:amolpwani/repo-name.git
```

### For `spideads-amol` repositories:

```bash
# Option 1: Use default
git remote add origin git@github.com:spideads-amol/repo-name.git

# Option 2: Be explicit
git remote add origin git@github.com-spideads:spideads-amol/repo-name.git
```

---

## 🎯 Quick Reference

### View SSH Keys
```bash
ls ~/.ssh/
```

### View Public Key
```bash
cat ~/.ssh/id_ed25519_amolpwani.pub
```

### Test SSH Connection
```bash
# Test amolpwani account
ssh -T git@github.com-amolpwani

# Test spideads-amol account
ssh -T git@github.com-spideads
```

### Check Git Remote
```bash
git remote -v
```

### Change Remote URL
```bash
# For amolpwani
git remote set-url origin git@github.com-amolpwani:amolpwani/repo-name.git

# For spideads-amol
git remote set-url origin git@github.com-spideads:spideads-amol/repo-name.git
```

---

## 🔐 Security Best Practices

1. **Never share private keys** (files without `.pub` extension)
2. **Only share public keys** (files with `.pub` extension)
3. **Use different keys** for different accounts
4. **Add passphrase** to keys for extra security (optional)
5. **Backup your keys** securely

---

## 🆘 Troubleshooting

### Issue: Permission Denied

```bash
# Check which key is being used
ssh -vT git@github.com-amolpwani

# Verify SSH config
cat ~/.ssh/config
```

### Issue: Wrong Account Being Used

```bash
# Make sure remote URL uses correct host
git remote -v

# Update if needed
git remote set-url origin git@github.com-amolpwani:amolpwani/sap-fullstack.git
```

### Issue: SSH Key Not Found

```bash
# Verify key exists
ls ~/.ssh/id_ed25519_amolpwani*

# Regenerate if needed
ssh-keygen -t ed25519 -C "amolpwani@github.com" -f ~/.ssh/id_ed25519_amolpwani
```

---

## ✨ Summary

You now have:
- ✅ Two separate SSH keys for two GitHub accounts
- ✅ SSH config managing both accounts
- ✅ This project configured for `amolpwani` account
- ✅ Existing `spideads-amol` account still works

**Next:** Add the public key to GitHub and push your code!

