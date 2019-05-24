#!/bin/bash

echo "Adjusting plist for App Transport Security exception."
val=$(/usr/libexec/plistbuddy -c "add NSAppTransportSecurity:NSExceptionDomains:nightcrew.herokuapp.com:NSTemporaryExceptionAllowsInsecureHTTPLoads bool true" platforms/ios/Nightcrew/Nightcrew-Info.plist 2>/dev/null)
echo "Done"