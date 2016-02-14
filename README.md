# react-pure-cropper

A set of React.js stateless components for image cropping and preview.

Work in progress, nothing works yet.

# Main idea

Currently available image cropping tools take too much as their responsibility. This fact makes it harder to integrate with state management libraries, such as Redux. Developer usually wants to get control other what exactly is rendered and why.

This repo consists of several stateless React components, providing cropper itself, crop preview and so on. Repo provides maths and logic to recount zoom and position as well. The logic binding the transformations and presentation is the responsibility of developer. There is an example of how this could be done. 
