# Facet Public Square

In collaboration with Facet Decision Systems, our goal in this project is to build a system that supports the collaboration and interaction among the different stakeholders when doing oil and gas pipeline planning. Pipeline planning includes a number of activities such as environmental impact analysis, growth and impact modeling, community engagement and many other. Through the system we are currently building, meetings that typically involve anywhere between 25 to 50 stakeholders will be supported using a range of technologies such as vertical displays, tabletops, iPads and iPhones.

# Getting Started with Facet Public Square

1. Gain access to the private Bitbucket Repository (if you are reading this on bitbucket, then you have access to it)
2. Download a git program (A basic command line program is [here](http://git-scm.com/))
3. Open the git program and clone the repository using this command: `git clone git@bitbucket.org:<bitbucket username>/facet-prototyping.git`


# Branches
- `master` - This is the stable branch. Bugs will be present, but hopefully not many. This branch can be found [here](http://asebeast2.cpsc.ucalgary.ca:81/facet-prototyping/default.html)
- `testing` - This is the testing branch. This is where we test new features and debug them before merging to master . This branch can be found [here](http://asebeast2.cpsc.ucalgary.ca:81/testing/facet-prototyping/default.html)
- `iOS` - This is the iOS branch. This is what will be shown on the iOS app

# Contributing to Facet Public Square
1. Before contributing. Make sure be working on the `testing` branch by executing the following git function: `git checkout testing`
2. Add new features and debug on `testing` branch
3. Commit and push the code by using: `git commit -a -m "<message>"` and `git push`
4. Test the [here](http://asebeast2.cpsc.ucalgary.ca:81/testing/facet-prototyping/default.html)
5. Repeat steps 2-4 until it is bug free.
6. Merge into master using: `git checkout master`, `git merge testing`, `git push`
7. Ensure everything still works [here](http://asebeast2.cpsc.ucalgary.ca:81/facet-prototyping/default.html), also test using various devices.