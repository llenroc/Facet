<?php
 
// Include twitteroauth
require_once('twitteroauth.php');
 
// Set keys found on your twitter application page.
//To set this up go to dev.twitter.com and login
//highlight your account name on the top right and click on my applications
//Create a new application with whatever parameters you like
//click on the new application and click settings
//Under "application type, select Read and Write and click the update settings at the bottom of the page
//Click the details tab and scroll down, click the create access token button and wait until the page updates. 
//The 4 tokens need to be copy/pasted to the variables below.


$consumerKey = 'Qz5JCPcXozcq1tQjTdh7Tw';
$consumerSecret = 'uJJcVzO42D9gXx9WA0XvVEc0B9WQUD7Hpgqq2WtsJUE';
$accessToken = '614641039-hNliaOyVue3NyyVW7IDaMmuSYEj3LKF4LYPIBURG';
$accessTokenSecret = 'ockC97LBWyc8vYbdkWe9hp9dnKA8l2dDSbKXruGBRfo';

// Create twitter authentication object
$tweet = new TwitterOAuth($consumerKey, $consumerSecret, $accessToken, $accessTokenSecret);

//Get the parameters of the URL for creating a custom message for the tweet
$hashtag = $_GET['hashtag'];
$location = $_GET['location'];
$name = $_GET['name'];
$type = $_GET['type'];
$filename = $_GET['filename'];

//Do whatever checking you want for ensuring which variables exist
if($hashtag != '' && $location != '' && $name != '' && $type != '' && $filename != '')
{
	// Set status message appending on the action and hashtag
	$tweetMessage = "Action: ".$name." added ".$type." (".$filename.") to the ".$location." #".$hashtag;
	 
	// Check for 140 characters tweet limit
	if(strlen($tweetMessage) <= 140)
	{
    	// Post the status message
    	$tweet->post('statuses/update', array('status' => $tweetMessage));
    	//Echo for testing by typing in url in browser, turn off for when called by javascript
    	echo('Tweated message!');
	}
}else
{
//Do something else when the arguments are invalid or the url is messed up
	echo('improper arguments #');
}


 
?>