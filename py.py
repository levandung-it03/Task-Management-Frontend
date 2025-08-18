import re

def fix_srt_timestamps(input_file, output_file):
    # Regex bắt timestamp dạng 00:14:25,800 --> 00:14:27,466
    timestamp_pattern = re.compile(r"(\d{2}:\d{2}:\d{2},\d{3})\s-->\s(\d{2}:\d{2}:\d{2},\d{3})")

    with open(input_file, "r", encoding="utf-8") as f:
        lines = f.readlines()

    new_lines = []
    for line in lines:
        match = timestamp_pattern.search(line)
        if match:
            start, end = match.groups()
            # Thêm "00:" vào đầu mỗi timestamp
            new_start = "00:" + start.replace(":", ":", 1)  # thêm 00: vào đầu
            new_end = "00:" + end.replace(":", ":", 1)
            new_line = f"{new_start} --> {new_end}\n"
            new_lines.append(new_line)
        else:
            new_lines.append(line)

    with open(output_file, "w", encoding="utf-8") as f:
        f.writelines(new_lines)


# Ví dụ chạy
fix_srt_timestamps(r"C:\Hau\DOWNLOAD\870.srt", r"C:\Hau\DOWNLOAD\9.srt")
