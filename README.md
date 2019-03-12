# MOOC-CA
## The problem statement
Sometimes, while doing your job, you gotta also find the right person to help you out. This person could be a student, intern etc.
Whenever you send out an opening, applicants come in huge numbers with impressive resumes and skill sets. It is often important to shortlist a few handful of candidates, who can be interviewed further.
To filter out the best candidates you may ask applicants to complete certain coding tasks. Such tasks are great to evaluate the technical insights of the candidates.
However, they may focus only on certain aspects of your project. From a broader perspective, you can agree that it is equally important that the selected candidate is well familiar with the wide array of technologies used in your project.
A way to do that is by leveraging the already existing online training materials available on websites like edX, Coursera, Udemy etc. Such courses have been created by experts and can help establish minimum competency for aspirants applying to work with you.

## What is MOOC-CA?
MOOC-CA is a platform that can help evaluators validate that the applicants have completed certain tasks on such online training platforms.
It is composed of a Chrome Extension and a Server. The evaluators publish their version of the chrome extension and setup the server. The aspirants install the chrome extension and make submissions to the server. The evaluators can then view the submissions made by the applicants and shortlist their best picks in an easier and more organized way.

This repository contains code and instructions for the MOOC-CA Chrome Extension.

## MOOC-CA PPT
Here is a [presentation](https://indico.cern.ch/event/742790/contributions/3198222/attachments/1748964/2832997/MOOC-CA.pdf) from CERN IT Lightning Talks #17 where MOOC-CA was presented on 8 Nov 2018.

# MOOC-CA Chrome Extension
Extension for chrome browser to validate that students have completed courses on MOOC platforms and online learning platforms.

# Setup Instructions

## Setting up Development Environment
1. Clone this git repository.
1. Open Chrome and navigate to      ```chrome://extensions```
1. Enable Developer Mode and click on Load Packed. Navigate to the root of the cloned git repository.
    ![chrome_extensions](https://developer.chrome.com/static/images/get_started/load_extension.png) 
1. Now you should see the application icon in the extension strip 
![mooc-ca installed](https://snag.gy/4sKz56.jpg)
1. If you haven't already, setup the MOOC-CA server now. Once done, head back to ```chrome://extensions```
1. Find MOOC-CA in the list of applications and click on the Details button to open the options page of the chrome extension.
![MOOC-CA details](https://snag.gy/sltdXN.jpg)
1. Scroll down and click on the pop-out window button next to Extension options
![](https://raw.githubusercontent.com/maany/MOOC-CA-User-Guide/master/media/details-view.png)
1. To connect the extension to the MOOC-CA dev server, fill up the absolute URL for Authorization(/oauth/auhtorize) and Token(oauth/token) endpoints. Make sure the port number is correct (It could also be 80 or 8080 depending on what version of MOOC-CA server).
![Extension Settings](https://snag.gy/o4DLhx.jpg)
1. Copy the Redirect_URI at the bottom of the OAuth2 client section. 
1. Register your chrome extension as an OAuth2 application on the MOOC-CA server. The server will return a **Client-ID** and **Client-Secret** which you need to fill up in the respective text boxes in the OAuth2 Client section.

1. Click the Save button at the bottom left side of the screen

1. Click on **Get New Token** to start the Authorization Code flow with the MOOC-CA Server. You'd be asked to log-in (using your user credentials on the MOOC-CA server) and authorize the chrome extension to make submissions on your behalf.

1. To actually make submissions, you might want to add pages that the extension should now monitor. See instructions in later sections.


# Adding Pages that the Extension should monitor
Let's say you want students to be able to submit their progress from the [Introduction to Kubernetes course by Linux Foundation](https://courses.edx.org/courses/course-v1:LinuxFoundationX+LFS158x+2T2017/course/) on edX.

1. Find URL of the progress page that students should submit to you. In this example it is [here](https://courses.edx.org/courses/course-v1:LinuxFoundationX+LFS158x+2T2017/progress).

1. Copy the progress page URL into the permissions array in manifest.json. Also add the fqdn of the server that hosts the MOOC-CA server to the same array.
    ```
    "permissions": [
     "activeTab",
     "https://courses.edx.org/courses/course-v1:LinuxFoundationX+LFS158x+2T2017/progress",
     "my-mooc-ca-server.domain"
     "]
    ```
1. Add a new object in the content scripts section of manifest.json. 
    ```
    {
        "matches": 
          [
            "https://courses.edx.org/courses/course-v1:LinuxFoundationX+LFS158x+2T2017/progress"
          ],
        "js": ["js/jquery-3.3.1.min.js", "content_handlers/kubernetes_edx.js"],
        "css": ["content_decorators/content.css"]
      },
    ```
    In the array corresding to the **js** key, you should specify a **content handler** script. This script is called when the student lands on the progress page of the course he/she is taking. It captures the HTML content of the page,
    You can use the default css which is located in ```content_decorators/content.css```
1. Create a Content Handler
    1. Create a file in content_handlers directory, the name of which should be present in the array coresponding to the *js* key of content script object you created in last step. In our example, the script is in ```content_handlers/kubernetes_edx.js```
    1. This script is called when the student lands on the progress page of the course whose URL was specified in the content scripts object in the previous step. Here is a template for the content script files:
    ```
    //content script template
    
    task_body = String($('body').html()) # fetch the HTML content of the progress page.
    
    // Here you can filter the HTML content that you want to send to the MOOC-CA server.
    Note: At the end, assign the String representation of the final HTML content to the task_body variable.
    //

    chrome.runtime.sendMessage({todo:"showPageAction"}) //Make the MOOC-CA icon active in the extension strip of Chrome.
    
    chrome.storage.sync.set({'task_title': "Containers_edX"}) // Assign a task title that will be submitted to the server

    chrome.storage.local.set({'html': task_body}) #set the final HTML content that should be submitted to the MOOC-CA server.

    # console.log(task_body) #uncomment to print debug information.
    ```
1. To add more courses for which you wish the see the progress of the students/applicants, repeat this process.

# Publishing/User Guide etc.
Once you have added all the courses and progress pages, you should upload your chrome extension to the Chrome App Store. 

1. **You should update the extension's name, version and description in manifest.json**

2. To publish the app on Chrome App Store, please go through the Instructions [here](https://developer.chrome.com/webstore/publish) 

Now you can share the link of your extension to students/applicants. Make sure you have also deployed a MOOC-CA server to which the submissions will be made. 

Consider creating a user-guide for the students. An example of the user guide is available [here](https://github.com/maany/MOOC-CA-User-Guide/blob/master/MOOC-CA-User-Guide.md)
