import re


class TokenType:

    def __init__(self, label, expression):
        self.label = label
        self.expression = expression
        self._compiled_expression = re.compile(expression, re.UNICODE)

    def match(self, s, pos=0):
        return self._compiled_expression.match(s, pos)

    def __repr__(self):
        return "TokenType(%r, %r)" % (self.label, self.expression)

    def __str__(self):
        return "%s" % self.label


def group(*choices):
    return '(' + '|'.join(choices) + ')'


WHITESPACE = TokenType("Whitespace", r'([ \f\t]+)')

STRING = TokenType("String", group(r"'[^\n']*(?:.[^\n']*)*'",
                                   r'"[^\n"]*(?:.[^\n"]*)*"'))

FLOAT = TokenType("Float", group(r'[0-9]+\.[0-9]+', r'\.[0-9]+'))
NUMBER = TokenType("Number", group(r'(?:0+|[1-9][0-9]*)'))
FRACTION = TokenType(
    "Fraction", group(NUMBER.expression + r'/' + NUMBER.expression))
MIXED_NUMBER = TokenType(
    "Mixed Number", group(NUMBER.expression + r' ' + FRACTION.expression))
WORD = TokenType("Word", r'(\w+)')

COMMA = TokenType("Comma", r'([,])')
PERIOD = TokenType("Period", r'([.])')
EXCLAMATION_POINT = TokenType("Exclamation Point", r'([\!])')
QUESTION_MARK = TokenType("QUESTION_MARK", r'([\?])')
COLON = TokenType("Colon", r'([:])')
SEMI_COLON = TokenType("Semi Colon", r'([;])')
HYPHEN = TokenType("Hyphen", r'([-])')
LEFT_PARENTHESIS = TokenType("Left Parenthesis", r'([\(])')
RIGHT_PARENTHESIS = TokenType("Left Parenthesis", r'([\)])')

NEWLINE = TokenType("Newline", r'(\r?\n)')
COMMENT = TokenType("Comment", r'(#[^\r\n]*)')

TOKEN_TYPES = (WHITESPACE,
               STRING,
               MIXED_NUMBER, FRACTION,
               FLOAT, NUMBER,
               WORD,
               COMMA, PERIOD, EXCLAMATION_POINT, QUESTION_MARK,
               COLON, SEMI_COLON, HYPHEN, LEFT_PARENTHESIS, RIGHT_PARENTHESIS,
               NEWLINE, COMMENT)


def tokenize(readline):
    while True:
        line = readline()
        pos = 0
        line_len = len(line)
        while pos < line_len:
            for tokentype in TOKEN_TYPES:
                match = tokentype.match(line, pos)
                if match:
                    token = match.group(1)
                    pos = match.end()
                    if tokentype != WHITESPACE:
                        yield tokentype, token
                    break
            else:
                raise Exception("Unable to parse %s at %d" % (line, pos))
                #skip over on character and continue
                #yield None, line[pos:pos+1]
                #pos = pos + 1


if __name__ == "__main__":
    import io
    import sys

    try:
        while True:
            print("> ", end="")
            sys.stdout.flush()
            line = io.StringIO(sys.stdin.readline())
            for tokentype, token in tokenize(line.__next__):
                print("%s(%s)" % (tokentype, token), end=" ")
            print()
    except KeyboardInterrupt:
        print("\nBye, bye!")