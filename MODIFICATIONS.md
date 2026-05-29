# Modifications by SeeYouLink, Inc.

This fork of the upstream Twilio Video App (React) project (https://github.com/twilio/twilio-video-app-react) contains modifications by SeeYouLink, Inc. and is provided as part of the Talaria platform.

**Upstream project:** twilio-video-app-react
**Upstream URL:** https://github.com/twilio/twilio-video-app-react
**Upstream license:** Apache License, Version 2.0 (see `LICENSE`)
**Fork maintainer:** SeeYouLink, Inc.
**Fork URL:** https://github.com/talaria-dev/twilio-video-app-react
**Modification period:** January 2022 to September 2023

This document is provided pursuant to Section 4(b) of the Apache License, Version 2.0, which requires that any modified files carry prominent notices stating that the files have been changed. SeeYouLink hereby provides such notice.

## Summary of modifications

SeeYouLink adapted the upstream Twilio Video sample application to function as a branded, Talaria-platform-integrated conference-room application. Modifications fall into four categories:

### 1. Talaria branding and identity

- Replaced upstream Twilio branding with Talaria branding in the user interface (favicon, logo component, page metadata).
- Added a `TalariaLogo` React component (`src/components/PreJoinScreens/RoomNameScreen/TalariaLogo.tsx`).
- Updated theme, color palette, and visual styling to match the Talaria product identity.

### 2. Platform integration

- Integrated the application with the SYL/Talaria signaling-and-token backend in place of the upstream Twilio Functions example.
- Added auto-join behavior so that users entering with a pre-resolved room identifier bypass the room-selection screen (`src/AutoJoinRoom.tsx`).
- Modified the `ChatProvider` to integrate with the Talaria messaging surface (`src/components/ChatProvider/index.tsx`).
- Updated `RecordingNotifications` to send Talaria-specific recording-rules API calls (`src/components/RecordingNotifications/RecordingNotifications.tsx`).
- Added a "toggle size" UI control for compact-vs-expanded conference window modes (`src/components/Buttons/ToggleSizeButton/ToggleSizeButton.tsx`).
- Adjusted device-selection and pre-join screens for the Talaria UX (`src/components/PreJoinScreens/`).

### 3. Build and deployment

- Modified the build process to produce bundles using relative paths for static assets so the application can be served from `s3://tlr-static/confroom/` and similar non-root deployment paths.
- Added GitHub Actions workflows for automated S3 deployment (`.github/workflows/deploy.yml`).
- Removed upstream issue templates and pull-request templates that are not applicable to the SeeYouLink fork.

### 4. Dependency hygiene

- Routine dependency updates and `npm audit` fixes applied periodically to maintain currency and address known vulnerabilities at time of update.
- `package.json`, `package-lock.json` updated accordingly.

## Modified source files

The following source files (in `src/`) were modified by SeeYouLink relative to the upstream baseline:

- `src/App.tsx`
- `src/AutoJoinRoom.tsx` (new file)
- `src/index.tsx`
- `src/state/index.tsx`
- `src/components/Buttons/EndCallButton/EndCallButton.tsx`
- `src/components/Buttons/ToggleSizeButton/ToggleSizeButton.tsx` (new file)
- `src/components/ChatProvider/index.tsx`
- `src/components/IntroContainer/IntroContainer.tsx`
- `src/components/MenuBar/Menu/Menu.tsx`
- `src/components/MenuBar/MenuBar.tsx`
- `src/components/MobileTopMenuBar/MobileTopMenuBar.tsx`
- `src/components/PreJoinScreens/PreJoinScreens.tsx`
- `src/components/PreJoinScreens/DeviceSelectionScreen/DeviceSelectionScreen.tsx`
- `src/components/PreJoinScreens/DeviceSelectionScreen/DeviceSelectionScreen.test.tsx`
- `src/components/PreJoinScreens/RoomNameScreen/RoomNameScreen.tsx`
- `src/components/PreJoinScreens/RoomNameScreen/RoomNameScreen.test.tsx`
- `src/components/PreJoinScreens/RoomNameScreen/TalariaLogo.tsx` (new file)
- `src/components/RecordingNotifications/RecordingNotifications.tsx`
- `src/components/Room/Room.tsx`
- `src/components/VideoProvider/useBackgroundSettings/useBackgroundSettings.ts`
- `src/components/VideoProvider/useLocalTracks/useLocalTracks.ts`

Plus modifications to build configuration, CI workflows, dependency manifests, and committed `build/` artifacts.

## Commit history

The complete history of SeeYouLink modifications is preserved in the fork's git log:

```
git log --author="Zoran" --author="Talaria" --oneline
```

As of the most recent activity, the fork contains approximately 29 commits authored by SeeYouLink contributors. All upstream Twilio commit history is preserved and unmodified.

## Compliance statement

Pursuant to Section 4 of the Apache License, Version 2.0:

- **(a)** The recipient of this fork is given a copy of the License in the `LICENSE` file in the root of this repository.
- **(b)** This `MODIFICATIONS.md` serves as a prominent notice that SeeYouLink, Inc. has modified files in this fork.
- **(c)** The upstream Twilio copyright notices and attribution statements are retained in the modified files where present. The form-of-use of the upstream code in this fork preserves all required upstream attributions.
- **(d)** No upstream `NOTICE` file exists in the Twilio upstream repository; accordingly there is no `NOTICE` file to preserve. If upstream subsequently publishes a `NOTICE` file, SeeYouLink will preserve and propagate it in this fork.

Redistribution of this fork in source or binary form must continue to comply with the terms of the Apache License, Version 2.0.
